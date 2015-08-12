export class Person {
  name: string
  uc: string
  github: string

  constructor(args) {
    this.name = args.name;
    this.uc = args.uc;
    this.github = args.github;
  }

  get email() {
    return this.uc + '@uc.cl';
  }

  get githubURL() {
    return 'https://github.com/' + this.github;
  }
}

export class Student extends Person {
  quitted: boolean
  section: number
  number: number

  constructor(args) {
    super(args);

    this.quitted = args.quitted === '1';
    this.section = parseInt(args.section);
    this.number = args.number;
  }
}

export class Assistent extends Person {
  area: string
  level: string
  phone: string

  constructor(args) {
    super(args);

    this.area = args.area;
    this.level = args.level;
    this.phone = args.phone;
  }

  get phoneWithArea() {
    return '+569' + this.phone;
  }
}
