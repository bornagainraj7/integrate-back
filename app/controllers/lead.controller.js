const moment = require('moment');
const fs = require('fs');
const util = require('util');
const logger = require('tracer').colorConsole();
const axios = require('axios').default;
const LeadModel = require('../models/lead.model');
const LeadCounterModel = require('../models/leadCounter.model');
const leadLib = require('../libs/lead.lib');
const responseLib = require('../libs/response.lib');
const nodemailerLib = require('../libs/nodemailer.lib');
const Cache = require('../../config/cache');

const cache = new Cache({
  namespace: 'Lead:byUser',
});

exports.newLead = async (req, res) => {
  const { body } = req;
  const search = { email: body.email };
  try {
    const response = await axios.post('https://api.insurancesamadhan.com/lead/search', search);
    logger.info(response.data);
    if (response.data.success) {
      if (response.data.data.length > 0) {
        if (response.data.data[0].status === 'PENDING') {
          throw new Error('already');
        }
      }
    }

    const presentLead = await leadLib.getLeadsByCondition(search);
    if (presentLead.length > 0) {
      if (presentLead[0].status === 'PENDING') {
        throw new Error('already');
      }
    }

    let leadCount = await leadLib.leadCounter();
    if (!leadCount) {
      leadCount = 1;
      await new LeadCounterModel({ _id: 'LeadCounter', counter: 1 }).save();
    }
    const leadId = moment().utcOffset(330).format(`YYYY-MM-DD-${leadCount}`);

    const newLead = new LeadModel({
      // eslint-disable-next-line
      ...body,
      leadId: leadId,
      userId: req.user.userId,
      assign_date: Date.now(),
      createdAt: Date.now(),
      src: 'vendor',
      med: req.user.userId,
      updatedAt: Date.now(),
      // communication: {
      //   'com_date': new Date(),
      //   'com_dis': body.ivr_discription,
      // },
      // created_date: Date.now(),
      // name: body.name,
      // email: body.email,
      // phone: body.phone,
      // location: body.location,
      // policyTypeId: body.policy_type,
      // companyId: body.inc_comp_name,
      // complaintTypeId: body.type_of_complain,
      // policy_number: body.policy_number,
      // issue_involves: body.issue_involves,
      // no_policys_involved: body.no_policys_involved,
      // follow_up: body.follow_up,
      // stage: body.stage,
      // dialed: body.dialed,
      // no_policy_year: body.no_policy_year,
      // total_value: body.total_value,
      // src: body.src,
      // user_id: body.user_id,
      // assign_to: body.user_id,
      // claim_amount: body.claim_amount,
    });

    const lead = await newLead.save();
    await leadLib.updateCounter();
    await nodemailerLib.leadSubmittedEmail(lead);
    return responseLib.success(res, 201, lead, 'New lead added successfully');
  } catch (error) {
    logger.error(error);
    if (error.message === 'already') {
      return responseLib.error(res, 409, null, 'We already have your lead, please be patient we\'ll reply soon');
    }
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};

exports.leadWithoutToken = async (req, res) => {
  const { userId } = req.params || req.query;
  const { body } = req;
  const search = { email: body.email };

  try {
    const response = await axios.post('https://api.insurancesamadhan.com/lead/search', search);
    logger.info(response.data);
    if (response.data.success) {
      if (response.data.data.length > 0) {
        if (response.data.data[0].status === 'PENDING') {
          throw new Error('already');
        }
      }
    }

    const presentLead = await leadLib.getLeadsByCondition(search);

    if (presentLead.length > 0) {
      if (presentLead[0].status === 'PENDING') {
        throw new Error('already');
      }
    }

    let leadCount = await leadLib.leadCounter();
    if (!leadCount) {
      leadCount = 1;
      await new LeadCounterModel({ _id: 'LeadCounter', counter: 1 }).save();
    }
    const leadId = moment().utcOffset(330).format(`YYYY-MM-DD-${leadCount}`);

    const newLead = new LeadModel({
      ...body,
      leadId: leadId,
      userId: userId,
      assign_date: Date.now(),
      createdAt: Date.now(),
      src: 'vendor',
      med: userId,
      updatedAt: Date.now(),
    });

    const lead = await newLead.save();
    await leadLib.updateCounter();
    await nodemailerLib.leadSubmittedEmail(lead);
    return responseLib.success(res, 201, lead, 'New lead added successfully');
  } catch (error) {
    logger.error(error);
    if (error.message === 'already') {
      return responseLib.error(res, 409, null, 'We already have your lead, please be patient we\'ll reply soon');
    }
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};

exports.updateLead = (req, res) => {
  const { body } = req;
  const leadId = req.params;
  const query = { _id: leadId };

  LeadModel.updateOne(query, body, { new: false })
    .then((result) => {
      if (result.nModified > 0) {
        return LeadModel.findById(leadId);
      }
      throw new Error('no-lead-found');
    })
    .then((lead) => {
      return responseLib.success(res, 200, lead, 'Lead updated successfully');
    })
    .catch((error) => {
      logger.error(error);
      if (error.message === 'no-lead-found') {
        return responseLib.error(res, 404, null, 'No Lead found');
      }
      return responseLib.error(res, 500, null, 'Server Error Occurred');
    });
};

exports.getLeadsByUser = async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const size = parseInt(req.query.size, 10);
  const { userId } = req.user;
  const condition = { userId };
  let allLeads;
  let userIdForLead;
  try {
    const leadData = await cache._get(userIdForLead);
    if (!leadData) {
      allLeads = await leadLib.getLeads(condition, page, size);
      /* set cache */
      cache._set(userIdForLead, JSON.stringify(allLeads));
    } else {
      allLeads = JSON.parse(leadData);
      logger.info('From Case....', leadData);
   }

    return responseLib.success(res, 200, allLeads, 'All leads for the user fetched succcessfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error occurred');
  }
};

exports.getSingleLead = async (req, res) => {
  const { leadId } = req.params;

  try {
    const lead = await leadLib.getSingleLead(leadId);
    return responseLib.success(res, 200, lead, 'Lead fetched successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};

exports.countLeadsByUser = async (req, res) => {
  const { userId } = req.user;
  const condition = { userId };
  try {
    const count = await leadLib.getLeadsCount(condition);
    return responseLib.success(res, 200, count, 'Number of leads fetched successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};


exports.addDocs = async (req, res) => {
  if (req.fileValidationError) {
    return responseLib.error(res, 415, null, 'File type not supported, please try .jpg, .jpeg, .png, .pdf');
  }
  // const { files } = req;
  const { userId } = req.user;
  const { leadId } = req.params;
  const readdir = util.promisify(fs.readdir);
  const folder = `./uploads/lead_documents/${userId}/${leadId}`;

  try {
    const file = await readdir(folder);
    const data = { $set: { doc: file } };
    await leadLib.updateLead({ _id: leadId }, data);

    return responseLib.success(res, 200, null, 'File(s) uploaded successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};


exports.addComment = async (req, res) => {
  const { userId } = req.user;
  const { name } = req.user;
  const { userName } = req.user;
  const { body } = req;
  const { leadId } = req.params;


  const update = {
    comment: body.comment,
    com_date: new Date(),
    name,
    userId,
    userName,
  };

  try {
    const data = { $push: { communication: update } };
    await leadLib.updateLead({ _id: leadId }, data);
    return responseLib.success(res, 201, null, 'Comment added successfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error Occurred');
  }
};


exports.filterLead = async (req, res) => {
  const { search } = req.params || req.query;
  const page = parseInt(req.query.page, 10);
  const size = parseInt(req.query.size, 10);
  const query = { $and: [] };
  const regex = new RegExp(search);
  const queryOR = { $or: [] };

  const name = {
    name: { $regex: regex, $options: 'i' },
  };
  queryOR.$or.push(name);

  const phone = {
    phone: { $regex: regex, $options: 'i' },
  };
  queryOR.$or.push(phone);

  const email = {
    email: { $regex: regex, $options: 'i' },
  };
  queryOR.$or.push(email);

  const leadId = {
    leadId: { $regex: regex, $options: 'i' },
  };
  queryOR.$or.push(leadId);

  const status = {
    status: { $regex: regex, $options: 'i' },
  };
  queryOR.$or.push(status);

  query.$and.push(queryOR);

  logger.info(query);

  const pipeline = [
    { $match: query },
    {
      $facet: {
        count: [{ $count: 'total' }],
        results: [{ $skip: page * size }, { $limit: size }],
      },
    },
  ];

  const stream = LeadModel.aggregate(pipeline).cursor().exec();
  stream.eachAsync((data) => {
    logger.info(data);
    const leadData = {
      count: data.count.length > 0 ? data.count[0].total : 0,
      data: data.results,
    };

    return responseLib.success(res, 200, leadData.data, 'Data filtered successfully');
  })
    .catch((error) => {
      logger.error(error);
      return responseLib.error(res, 500, null, 'Server Error Occurred');
    });
};
