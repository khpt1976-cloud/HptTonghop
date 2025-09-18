import { NavigationItem, NavigationTreeNode } from '../types/navigation';

/**
 * Utility functions for navigation data manipulation
 */
export class NavigationUtils {
  /**
   * Convert flat navigation items to tree structure
   */
  static buildNavigationTree(items: NavigationItem[]): NavigationItem[] {
    const itemMap = new Map<string, NavigationItem>();
    const rootItems: NavigationItem[] = [];

    // Create a map of all items
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Build the tree structure
    items.forEach(item => {
      const currentItem = itemMap.get(item.id)!;
      
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(currentItem);
      } else {
        rootItems.push(currentItem);
      }
    });

    // Sort items by order
    const sortByOrder = (items: NavigationItem[]) => {
      items.sort((a, b) => a.order - b.order);
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          sortByOrder(item.children);
        }
      });
    };

    sortByOrder(rootItems);
    return rootItems;
  }

  /**
   * Convert navigation items to Ant Design Tree data
   */
  static convertToTreeData(items: NavigationItem[]): NavigationTreeNode[] {
    return items.map(item => ({
      ...item,
      key: item.id,
      title: item.name,
      children: item.children ? this.convertToTreeData(item.children) : undefined,
    }));
  }

  /**
   * Flatten tree structure to flat array
   */
  static flattenNavigationTree(items: NavigationItem[]): NavigationItem[] {
    const result: NavigationItem[] = [];
    
    const flatten = (items: NavigationItem[], level = 0) => {
      items.forEach(item => {
        const flatItem = { ...item };
        delete flatItem.children;
        result.push(flatItem);
        
        if (item.children && item.children.length > 0) {
          flatten(item.children, level + 1);
        }
      });
    };
    
    flatten(items);
    return result;
  }

  /**
   * Find navigation item by ID in tree structure
   */
  static findNavigationItem(items: NavigationItem[], id: string): NavigationItem | null {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      
      if (item.children && item.children.length > 0) {
        const found = this.findNavigationItem(item.children, id);
        if (found) {
          return found;
        }
      }
    }
    
    return null;
  }

  /**
   * Get all parent IDs for a navigation item
   */
  static getParentIds(items: NavigationItem[], targetId: string): string[] {
    const parentIds: string[] = [];
    
    const findParents = (items: NavigationItem[], targetId: string, currentPath: string[] = []): boolean => {
      for (const item of items) {
        const newPath = [...currentPath, item.id];
        
        if (item.id === targetId) {
          parentIds.push(...currentPath);
          return true;
        }
        
        if (item.children && item.children.length > 0) {
          if (findParents(item.children, targetId, newPath)) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    findParents(items, targetId);
    return parentIds;
  }

  /**
   * Validate if a parent selection would create a circular reference
   */
  static wouldCreateCircularReference(
    items: NavigationItem[],
    itemId: string,
    parentId: string
  ): boolean {
    if (itemId === parentId) {
      return true;
    }
    
    const item = this.findNavigationItem(items, itemId);
    if (!item) {
      return false;
    }
    
    // Check if the proposed parent is a descendant of the current item
    const isDescendant = (items: NavigationItem[], ancestorId: string, descendantId: string): boolean => {
      const ancestor = this.findNavigationItem(items, ancestorId);
      if (!ancestor || !ancestor.children) {
        return false;
      }
      
      for (const child of ancestor.children) {
        if (child.id === descendantId) {
          return true;
        }
        
        if (isDescendant(items, child.id, descendantId)) {
          return true;
        }
      }
      
      return false;
    };
    
    return isDescendant(items, itemId, parentId);
  }

  /**
   * Get navigation item depth in tree
   */
  static getNavigationDepth(items: NavigationItem[], targetId: string): number {
    const findDepth = (items: NavigationItem[], targetId: string, currentDepth = 0): number => {
      for (const item of items) {
        if (item.id === targetId) {
          return currentDepth;
        }
        
        if (item.children && item.children.length > 0) {
          const depth = findDepth(item.children, targetId, currentDepth + 1);
          if (depth !== -1) {
            return depth;
          }
        }
      }
      
      return -1;
    };
    
    return findDepth(items, targetId);
  }

  /**
   * Filter navigation items by search term
   */
  static filterNavigationItems(items: NavigationItem[], searchTerm: string): NavigationItem[] {
    if (!searchTerm.trim()) {
      return items;
    }
    
    const term = searchTerm.toLowerCase();
    // const filtered: NavigationItem[] = [];
    
    const filterRecursive = (items: NavigationItem[]): NavigationItem[] => {
      const result: NavigationItem[] = [];
      
      for (const item of items) {
        const matchesSearch = 
          item.name.toLowerCase().includes(term) ||
          item.path.toLowerCase().includes(term) ||
          (item.permissions && item.permissions.some(p => p.toLowerCase().includes(term)));
        
        let filteredChildren: NavigationItem[] = [];
        if (item.children && item.children.length > 0) {
          filteredChildren = filterRecursive(item.children);
        }
        
        if (matchesSearch || filteredChildren.length > 0) {
          result.push({
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : undefined,
          });
        }
      }
      
      return result;
    };
    
    return filterRecursive(items);
  }

  /**
   * Sort navigation items by specified field
   */
  static sortNavigationItems(
    items: NavigationItem[],
    sortField: keyof NavigationItem,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): NavigationItem[] {
    const sorted = [...items].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    // Recursively sort children
    return sorted.map(item => ({
      ...item,
      children: item.children 
        ? this.sortNavigationItems(item.children, sortField, sortOrder)
        : undefined,
    }));
  }
}

export default NavigationUtils;