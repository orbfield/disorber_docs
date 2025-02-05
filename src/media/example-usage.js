// Example of how to use mediaScanner:

import { scanMediaDirectory, getMediaUrl } from './mediaScanner';

// Get the full media tree structure
const loadMediaTree = async () => {
  const mediaTree = await scanMediaDirectory();
  console.log('Media tree:', mediaTree);
  // Returns structure like:
  // [
  //   {
  //     id: 'hilbert-bell',
  //     text: 'Hilbert Bell',
  //     icon: 'Folder',
  //     isExpanded: false,
  //     children: [
  //       {
  //         id: 'hilbert-bell/side',
  //         text: 'Side',
  //         icon: 'Folder',
  //         children: []
  //       },
  //       {
  //         id: 'hilbert-bell/top',
  //         text: 'Top',
  //         icon: 'Folder',
  //         children: [
  //           {
  //             id: 'hilbert-bell/top/1-0.2-50.gif',
  //             text: '1-0.2-50.gif',
  //             icon: 'Play',
  //             type: 'gif'
  //           },
  //           // ... more files
  //         ]
  //       }
  //     ]
  //   }
  // ]
};

// Get URL for a specific media file
const loadSpecificMedia = () => {
  const mediaUrl = getMediaUrl('hilbert-bell/top/1-0.2-50.gif');
  console.log('Media URL:', mediaUrl);
  // Can be used in <img> tags etc.
};
