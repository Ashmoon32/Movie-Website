const fs = require('fs');
const path = require('path');

class JSONDatabase {
  constructor(filename) {
    this.filePath = path.join(__dirname, '..', 'data', filename);
    this.ensureFileExists();
  }

  ensureFileExists() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]');
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing to ${this.filePath}:`, error);
      return false;
    }
  }

  findAll() {
    return this.read();
  }

  findById(id) {
    const items = this.read();
    return items.find(item => item.id === id);
  }

  create(item) {
    const items = this.read();
    items.push(item);
    this.write(items);
    return item;
  }

  update(id, updates) {
    const items = this.read();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.write(items);
      return items[index];
    }
    return null;
  }

  delete(id) {
    const items = this.read();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      const deleted = items.splice(index, 1)[0];
      this.write(items);
      return deleted;
    }
    return null;
  }

  findByField(field, value) {
    const items = this.read();
    return items.filter(item => item[field] === value);
  }
}

module.exports = JSONDatabase;