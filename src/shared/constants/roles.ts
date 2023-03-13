export const ROLES = {
  ADMIN: "admin",
  STORE: "store",
  CUSTOMER: "customer",
};

export const IMPORT_CUSTOMER = "import_customer";

export const optionRoleType = [
  {
    value: ROLES.CUSTOMER,
    label: "customer_receiver",
  },
  {
    value: ROLES.STORE,
    label: "store_receiver",
  },
  {
    value: IMPORT_CUSTOMER,
    label: "import_user",
  },
];

export default optionRoleType;
