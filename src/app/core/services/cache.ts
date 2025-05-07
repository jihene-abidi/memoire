import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, HttpResponse<any>>();
    clearCache(url: string): void {
    if (url) {
      Object.keys(localStorage).forEach((key) => {
        if (key.includes(url)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      this.cache.clear();
      Object.keys(localStorage).forEach((key) => {
        if (key.includes(url)) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  removeMultipleItems(keys: string[]) {
    const filteredKeys = keys.filter(key => key.startsWith('/'));
    filteredKeys.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  getAllKeys() {
    return Object.keys(localStorage);
  }
  set(url: string, response: HttpResponse<any>): void {
    this.cache.set(url, response);
  }

  get(url: string): HttpResponse<any> | undefined {
    return this.cache.get(url);
  }

  clear(url: string): void {
    this.cache.delete(url);
  }

  clearAll(): void {
    this.cache.clear();
  }
  clearByPattern(pattern: string): void {
    console.log(`🔍 Checking cache keys for pattern: ${pattern}`);
    
    if (this.cache.size === 0) {
      console.log('⚠️ Cache is empty.');
    } else {
      console.log('📌 Current cache keys:');
      for (const key of this.cache.keys()) {
        console.log(`  - ${key}`);
        if (key.includes(pattern)) {
          console.log(`❌ Clearing cache for key: ${key}`);
          this.cache.delete(key);
        }
      }
    }
  }
  
  
}
