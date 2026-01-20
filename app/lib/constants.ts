// export const ADMIN_CREATABLE_ROLES = [
//   "ADMIN",
//   "MANAGER",
//   "TECHNICIAN",
// ];


export const ROUTE_RULES = [
  {
    path: "/admin",
    permission: "USER_MANAGE",
  },
  {
    path: "/technician",
    permission: "SR_UPDATE_STATUS",
  },
  {
    path: "/dashboard",
    permission: "SR_VIEW_OWN",
  },
];
