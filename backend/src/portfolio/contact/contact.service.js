const Contact = require("./contact.model");

exports.createMessage = async (data) => {
  return await Contact.create(data);
};

exports.getAllMessages = async () => {
  return await Contact.find().sort({ createdAt: -1 });
};

exports.deleteMessage = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
