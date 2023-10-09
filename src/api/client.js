import axios from 'axios';

const client = axios.create({
  baseURL: "http://35.239.90.168:8080/transeats",
});

export default client;
