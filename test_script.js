const fs = require('fs');

const extractUsernames = (data) => {
  let items = [];

  if (Array.isArray(data)) {
    items = data;
  } else if (data && typeof data === 'object') {
    const preferred = ['relationships_following', 'relationships_followers', 'connections'];
    let found = false;
    for (const key of preferred) {
      if (Array.isArray(data[key])) { items = data[key]; found = true; break; }
    }
    if (!found) {
      for (const val of Object.values(data)) {
        if (Array.isArray(val)) { items = val; break; }
      }
    }
  }

  const usernames = new Set();

  for (const item of items) {
    if (!item) continue;

    if (Array.isArray(item.string_list_data)) {
      for (const e of item.string_list_data) {
        if (e && typeof e.value === 'string' && e.value.trim())
          usernames.add(e.value.trim().toLowerCase());
      }
    }
    if (typeof item.value === 'string' && item.value.trim())
      usernames.add(item.value.trim().toLowerCase());
    if (typeof item === 'string' && item.trim())
      usernames.add(item.trim().toLowerCase());
  }

  return usernames;
};

const fData = JSON.parse(fs.readFileSync('followers_1.json', 'utf8'));
const ingData = JSON.parse(fs.readFileSync('following.json', 'utf8'));

console.log("Followers:", extractUsernames(fData).size);
console.log("Following:", extractUsernames(ingData).size);
