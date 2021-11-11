import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {
  constructor() {};

  async uploadFile(file) {
    try {
      await axios.post('http://localhost:3001/bulk/file', file);
    } catch (error) {
      throw new Error(error);
    }
  }
}
