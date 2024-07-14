const express = require('express');
const router = express.Router();
const {
  addEnquiry,
  getEnquiriesByProjectId,
  removeEnquiry,
} = require('../controllers/enquiryController');

router.post('/', addEnquiry);
router.get('/project/:projectId', getEnquiriesByProjectId);
router.delete('/:enquiryId', removeEnquiry);

module.exports = router;
