import {Task} from '@lit-labs/task';

export class ApiController {
  constructor(url) { 
    this.task = this.fetch(url)
    this.taskResult;
  }

  async fetch(url){
    let task;
    task = await this.taskFetch(url);
    this.taskResult = task;
    return task;
  }
  async taskFetch(url){
    return fetch(`${url}`)
    .then((response) => {return response.json()})
    .catch((error) => {
      console.error('Error:', error);
    });
  }


}
