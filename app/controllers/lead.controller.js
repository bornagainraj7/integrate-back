const moment = require('moment');
const logger = require('tracer').colorConsole();
const LeadModel = require('../models/lead.model');
const leadLib = require('../libs/lead.lib');
const responseLib = require('../libs/response.lib');
const nodemailerLib = require('../libs/nodemailer.lib');


exports.newLead = async (req, res) => {
  const { body } = req;
  try {
    const leadCount = await leadLib.count({});
    const leadId = moment().utcOffset(330).format(`YYYY-MM-DD-${leadCount + 1}`);

    const newLead = new LeadModel({
      // eslint-disable-next-line
      ...body,
      leadId: leadId,
      userId: req.user.userId,
      assign_date: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      communication: {
        'com_date': new Date(),
        'com_dis': body.ivr_discription,
      },
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

    await nodemailerLib.leadSubmittedEmail(lead);
    return responseLib.success(res, 201, lead, 'new lead added successfully');
  } catch (error) {
    logger.error(error);
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
  const { userId } = req.user;
  const condition = { userId };
  try {
    const leads = await leadLib.getLeads(condition);
    return responseLib.success(res, 200, leads, 'All leads for the user fetched succcessfully');
  } catch (error) {
    logger.error(error);
    return responseLib.error(res, 500, null, 'Server Error occurred');
  }
};
