export type ChangePasswordRequest = {
  current_password?: string;
  new_password: string;
};

export type ChangePasswordResponse = {
  message: string;
};

export type ChangePasswordError = {
  detail?: string[];
  new_password?: string[];
};
