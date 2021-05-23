import axios from 'axios';

async function createEvent () {
  try {
    
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export {
  createEvent
};