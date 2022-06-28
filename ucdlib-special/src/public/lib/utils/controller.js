import {Task} from '@lit-labs/task';
import { LitElement} from 'lit';

export class ApiController extends LitElement{
  host;
//   value;
//   kinds = Names.kinds;
//   task;
  constructor(host, url) {
    const baseUrl = url;
    this.url = baseUrl;
    this.host = host;
    console.log(this.host);
    this.task = new Task(
      this.host,
      async () => {
        const response = await fetch(`${baseUrl}`);
        const result = await response.json();
        const error = result.error;
        if (error !== undefined) {
          throw new Error(error);
        }
        return result;
      },
        
      () => [this.url]
    );

  }


  render(renderFunctions) {
    return this.task.render(renderFunctions);
  }



}
