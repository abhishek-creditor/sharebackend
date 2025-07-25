const Role = require("../models/role");
const User = require("../models/user");
const Cms = require("../models/cms");
const CONST_KEY = require("./constantKey");
const Support = require("../models/support");
const Faq = require("../models/faq");
const runInitialDBScript = async () => {
  // Default role data
  const defaultRoles = [
    { role: CONST_KEY.ROLE.ADMIN },
    { role: CONST_KEY.ROLE.USER },
    { role: CONST_KEY.ROLE.BUSINESS },
  ];

  // Function to create default roles
  async function createDefaultRole() {
    try {
      const count = await Role.countDocuments();
      if (count === 0) {
        await Role.insertMany(defaultRoles);
      }
    } catch (error) {
      console.error("Error creating default roles:", error);
    }
  }

  // Function to create default users
  async function createDefaultUser() {
    try {
      const adminRoleData = await Role.findOne({ role: CONST_KEY.ROLE.ADMIN });

      if (!adminRoleData) {
        console.error("Roles not found");
        return;
      }

      const hashedPassword = await bcrypt.hash("password123", 10);
      const defaultUsers = [
        {
          email: "john.doe@example.com",
          password: hashedPassword,
          role_id: adminRoleData._id,
          status: 1,
          full_name: "John Doe",
          mobile_number: "1234567890",
        },
        {
          email: "susan.doe@example.com",
          password: hashedPassword,
          role_id: adminRoleData._id,
          status: 1,
          full_name: "Susan Doe",
          mobile_number: "1234567890",
        },
        {
          email: "david.doe@example.com",
          password: hashedPassword,
          role_id: adminRoleData._id,
          status: 1,
          full_name: "David Doe",
          mobile_number: "1234567890",
        },
        {
          email: "ravi.radadiya@quytech.com",
          password: hashedPassword,
          role_id: adminRoleData._id,
          status: 1,
          full_name: "Ravi Radadiya",
          mobile_number: "7048795128",
        },
      ];

      // Check for existing admin users
      const existingAdmins = await User.find({ role_id: adminRoleData._id });
      if (existingAdmins.length === 0) {
        await User.insertMany(defaultUsers);
      } else {
        // console.log("Already exists")
      }
    } catch (error) {
      console.error("Error creating default users:", error);
    }
  }

  // Function to create default CMS
  async function createDefaultCMS() {
    try {
      const existingCMS = await Cms.find();
      if (existingCMS.length === 0) {
        let cmsData = [
          {
            type: CONST_KEY.CMS_TYPE.PRIVACY_POLICY,
            role: CONST_KEY.CMS_ROLE.USER,
            title: "Privacy Policy",
            description:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          },
          {
            type: CONST_KEY.CMS_TYPE.TERM_AND_CONDITION,
            role: CONST_KEY.CMS_ROLE.USER,
            title: "Term and Condition",
            description:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          },
          {
            type: CONST_KEY.CMS_TYPE.PRIVACY_POLICY,
            role: CONST_KEY.CMS_ROLE.BUSINESS,
            title: "Privacy Policy",
            description:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          },
          {
            type: CONST_KEY.CMS_TYPE.TERM_AND_CONDITION,
            role: CONST_KEY.CMS_ROLE.BUSINESS,
            title: "Term and Condition",
            description:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          },
        ];
        await Cms.insertMany(cmsData);
      }
    } catch (error) {
      console.error("Error creating default users:", error);
    }
  }

  // Function to create default Support
  async function createDefaultSupport() {
    try {
      const existingSupport = await Support.find();
      if (existingSupport.length === 0) {
        let supportData = {
          email:"support@binjon.com",
          phone:"1800 2400 3333"
        }
        await Support.create(supportData);
      }
    } catch (error) {
      console.error("Error creating default users:", error);
    }
  }

  //write function for faq
  async function createDefaultFaq() {
    try {
      const existingFaq = await Faq.find();
      if (existingFaq.length === 0) {
        let faqData = [
          {
            question: "What is Lorem Ipsum?",
            answer:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          },
          {
            question: "Why do we use it?",
            answer:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          },
          {
            question: "Where can I get some?",
            answer:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          },
        ];
        await Faq.insertMany(faqData);
      }
    } catch (error) {
      console.error("Error creating default users:", error);
    }
  }

  //*** Initials Script ***
  //createDefaultUser
  createDefaultRole();
  createDefaultCMS();
  createDefaultSupport()
  createDefaultFaq()
};
module.exports = runInitialDBScript;
