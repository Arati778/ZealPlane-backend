const asynchandler = require("express-async-handler");
const Contact = require("../models/contactModels");

const getContactS = asynchandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

const createContact = asynchandler(async (req, res) => {
  console.log("Ther rquested body is :", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All Fields are mandatory!");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id
  });
  res.status(201).json(contact);
});

const getContact = asynchandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not Found!");
        
    }
  res.status(200).json({ contact });
});

const updateContact = asynchandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found!");
    
}

if(contact.user_id.toString() !== req.user.id){
  res.status(403);
  throw new Error("User don't have permission to update other user contacts !");
}

const updatedContact =  await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true }
)
res.status(200).json({ updatedContact });
});

const deleteContact = asynchandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not Found!");
        
    }

    if(contact.user_id.toString() !== req.user.id){
      res.status(403);
      throw new Error("User don't have permission to delete other user contacts !");
    }

    await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: `Delete Contacts for ${req.params.id}!` });
});

module.exports = {
  getContact,
  updateContact,
  deleteContact,
  getContactS,
  createContact,
};
