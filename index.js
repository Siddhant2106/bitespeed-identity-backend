const { Op } = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const Contact = require('./models/contact');
const sequelize = require('./config/db');

const app = express();
app.use(bodyParser.json());

app.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "At least email or phoneNumber required" });
  }

  // Fetch matching contacts
  const contacts = await Contact.findAll({
    where: {
        [Op.or]: [
            email ? { email } : null,
            phoneNumber ? { phoneNumber } : null
        ].filter(Boolean)
    },
    order: [['createdAt']]
  });

  // Step 1: No matches
  if (!contacts.length) {
    const newContact = await Contact.create({ email, phoneNumber, linkPrecedence: 'primary', linkedId: null });
    return res.json({
      contact: {
        primaryContactId: newContact.id,
        emails: [email],
        phoneNumbers: [phoneNumber],
        secondaryContactIds: []
      }
    });
  }

  // Step 2: One or more matches
  // Find all unique IDs involved
  let primary = contacts.find(c => c.linkPrecedence === 'primary') || contacts[0];
  let allContacts = await Contact.findAll({
    where: {
      [sequelize.Op.or]: [
        { id: primary.id },
        { linkedId: primary.id }
      ]
    }
  });

  // Check if the email or phone is new, add as secondary
  let existingEmail = allContacts.some(contact => contact.email === email);
  let existingPhone = allContacts.some(contact => contact.phoneNumber === phoneNumber);

  if (!(existingEmail && existingPhone)) {
    // Add new secondary
    const newContact = await Contact.create({
      email: existingEmail ? null : email,
      phoneNumber: existingPhone ? null : phoneNumber,
      linkPrecedence: 'secondary',
      linkedId: primary.id
    });
    allContacts = [...allContacts, newContact];
  }

  // Prepare response
  let emails = Array.from(new Set(allContacts.map(c => c.email).filter(Boolean)));
  let phoneNumbers = Array.from(new Set(allContacts.map(c => c.phoneNumber).filter(Boolean)));
  let secondaryContactIds = allContacts.filter(c => c.linkPrecedence === 'secondary').map(c => c.id);

  res.json({
    contact: {
      primaryContactId: primary.id,
      emails,
      phoneNumbers,
      secondaryContactIds
    }
  });
});

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});


// DB sync and server start
sequelize.sync().then(() => {
  app.listen(3000, () => console.log("Server on http://localhost:3000"));
});
