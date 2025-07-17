const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseService {
  constructor() {
    this.dbPath = path.join(__dirname, '..', 'albums.db');
    this.db = null;
    this.init();
  }

  init() {
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.createTable();
      }
    });
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS album_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        genre TEXT UNIQUE NOT NULL,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(sql, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Album cache table ready');
      }
    });

    // Create feedback table
    const feedbackSql = `
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        feedback TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(feedbackSql, (err) => {
      if (err) {
        console.error('Error creating feedback table:', err.message);
      } else {
        console.log('Feedback table ready');
      }
    });
  }

  async getAlbumData(genre) {
    return new Promise((resolve, reject) => {
      const normalizedGenre = genre.toLowerCase().trim();
      const sql = 'SELECT data FROM album_cache WHERE genre = ?';
      
      this.db.get(sql, [normalizedGenre], (err, row) => {
        if (err) {
          console.error('Error fetching from cache:', err.message);
          reject(err);
        } else if (row) {
          console.log(`Found cached data for genre: ${genre}`);
          try {
            const data = JSON.parse(row.data);
            resolve(data);
          } catch (parseErr) {
            console.error('Error parsing cached JSON:', parseErr.message);
            reject(parseErr);
          }
        } else {
          console.log(`No cached data found for genre: ${genre}`);
          resolve(null);
        }
      });
    });
  }

  async saveAlbumData(genre, data) {
    return new Promise((resolve, reject) => {
      const normalizedGenre = genre.toLowerCase().trim();
      const jsonData = JSON.stringify(data);
      
      const sql = `
        INSERT OR REPLACE INTO album_cache (genre, data, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `;
      
      this.db.run(sql, [normalizedGenre, jsonData], function(err) {
        if (err) {
          console.error('Error saving to cache:', err.message);
          reject(err);
        } else {
          console.log(`Cached data for genre: ${genre}`);
          resolve(this.lastID);
        }
      });
    });
  }

  async clearCache() {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM album_cache';
      
      this.db.run(sql, (err) => {
        if (err) {
          console.error('Error clearing cache:', err.message);
          reject(err);
        } else {
          console.log('Cache cleared');
          resolve();
        }
      });
    });
  }

  async getCachedGenres() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT genre, created_at FROM album_cache ORDER BY created_at DESC';
      
      this.db.all(sql, (err, rows) => {
        if (err) {
          console.error('Error fetching cached genres:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async saveFeedback(feedbackData) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO feedback (feedback, timestamp) VALUES (?, ?)';
      
      this.db.run(sql, [feedbackData.feedback, feedbackData.timestamp], function(err) {
        if (err) {
          console.error('Error saving feedback:', err.message);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  async getAllFeedback() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM feedback ORDER BY created_at DESC';
      
      this.db.all(sql, (err, rows) => {
        if (err) {
          console.error('Error fetching feedback:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

module.exports = new DatabaseService();
