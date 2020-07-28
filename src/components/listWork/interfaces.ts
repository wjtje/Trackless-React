export interface Work {
  info:   Info;
  length: number;
  result: Result[];
}

export interface Info {
  status:  number;
  message: string;
}

export interface Result {
  work_id:     number;
  user:        User;
  group:       Group;
  location:    Location;
  time:        number;
  date:        string;
  description: string;
}

export interface Group {
  group_id:  number;
  groupName: string;
}

export interface Location {
  location_id: number;
  place:       string;
  name:        string;
  id:          string;
}

export interface User {
  user_id:   number;
  firstname: string;
  lastname:  string;
  username:  string;
}