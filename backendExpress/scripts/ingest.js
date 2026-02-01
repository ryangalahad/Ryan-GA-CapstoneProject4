import https from 'https';
import fs from 'fs';
import path from 'path';

const DOWNLOAD_URL = 'https://data.opensanctions.org/datasets/latest/default/entities.ftm.json';
const SAVE_PATH = path.join(__dirname, '../data/watchlist.json');

const downloadFile = () => {
  console.log('Starting download from OpenSanctions...');
  
  const file = fs.createWriteStream(SAVE_PATH);
  
  https.get(DOWNLOAD_URL, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download: ${response.statusCode}`);
      return;
    }

    // Pipe the response directly to a local file
    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log('Download completed! File saved to:', SAVE_PATH);
    });
  }).on('error', (err) => {
    fs.unlink(SAVE_PATH, () => {}); // Delete the partial file on error
    console.error('Download error:', err.message);
  });
};

downloadFile();