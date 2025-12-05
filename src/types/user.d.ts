interface UserRegister {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  password: string;
}

interface UserUpdate extends Omit<UserRegister, "password"> { }