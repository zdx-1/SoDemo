import { cloneDeep } from 'lodash-es';

export interface TreeNodeProps {
  idKey?: string;
  parentIdKey?: string;
  nameKey?: string;
  childrenKey?: string;
  sortKey?: string;
  rowHandle?: Function; // 行处理
}
export class TreeNode<T> {
  idKey: string;
  parentIdKey: string;
  nameKey: string;
  childrenKey: string;
  sortKey: string;
  rowHandle?: Function;
  constructor(props: TreeNodeProps) {
    this.idKey = props.idKey || 'id';
    this.nameKey = props.nameKey || 'name';
    this.parentIdKey = props.parentIdKey || 'parentId';
    this.childrenKey = props.childrenKey || 'children';
    this.sortKey = props.sortKey || 'sort';
    this.rowHandle = props.rowHandle;
  }
  /**
   * 构建树
   * @param data
   * @param parentId
   * @returns
   */
  public build(data: Array<T>, parentId: string | number): Array<T> {
    const copyData = cloneDeep(data);
    return this._build(copyData, parentId);
  }
  /**
   * 构建树
   * @param data
   * @param parentId
   * @returns
   */
  private _build(data: Array<T>, parentId: string | number): Array<T> {
    const res: Array<any> = [];
    if (!data.length) return res;
    const list = this.findByParentId(data, parentId);
    res.push(...list);
    list.forEach((item: any) => {
      const children = this.findByParentId(data, item.id);
      if (children.length) {
        item[this.childrenKey] = children;
        children.forEach((itemm: any) => {
          itemm[this.childrenKey] = this.build(data, itemm.id);
          if (!itemm[this.childrenKey].length) {
            itemm[this.childrenKey] = undefined;
          }
          if (this.rowHandle && typeof this.rowHandle == 'function') {
            this.rowHandle(itemm);
          }
        });
      } else {
        item[this.childrenKey] = undefined;
      }
      if (this.rowHandle && typeof this.rowHandle == 'function') {
        this.rowHandle(item);
      }
    });
    return res;
  }
  /**
   * 通过父id获取所有子元素
   * @param data
   * @param parentId
   * @returns
   */
  public findByParentId(data: Array<T>, parentId: string | number): Array<T> {
    return data
      .filter((item: any) => {
        return item[this.parentIdKey] == parentId && item[this.idKey] && item[this.nameKey];
      })
      .sort((a, b) => {
        return (a[this.sortKey] || 999) - (b[this.sortKey] || 999);
      });
  }
  /**
   * 获取节点中的所有子ids
   * @param nodeData 节点
   * @param hasSelf 是否包含自身
   * @returns
   */
  public getChildIds(nodeData: any, hasSelf: boolean): [] {
    const res: any = [];
    if (!nodeData) {
      return res;
    }
    if (hasSelf) {
      res.push(nodeData?.[this.idKey]);
    }
    if (nodeData?.[this.childrenKey]) {
      nodeData?.[this.childrenKey].forEach((child: any) => {
        res.push(...this.getChildIds(child, true));
      });
    }
    return res;
  }
}

/**
 * 查询ant树的节点
 * @param key 节点唯一标识
 * @param treeData ant树型数据
 * @returns 节点信息 { key: '', title: '', value: '', pid: '' }
 */
export const getAntTreeNode = (key, treeData) => {
  let node; // 定义返回结果
  /**
   * 内部匿名函数
   * @param {*} key
   * @param {*} mTreeData
   */
  const findNode = (key, mTreeData) => {
    for (let i = 0; i < mTreeData.length; i++) {
      if (node) break; // 已找到，退出循环
      const item = mTreeData[i];
      if (item.key == key) {
        // 找到岀跳出循环
        node = item;
        node.pid = '0';
        break;
      } else {
        // 未找到，则继续从子中查询
        if (item.children && item.children.length > 0) {
          findNode(key, item.children);
          if (node) {
            // 设置pid
            node.pid = item.key;
            break;
          }
        } else {
          // 跳出当前递归，返回上层递归
          break;
        }
      }
    }
  };
  // 调用内部函数
  findNode(key, treeData);
  return node;
};
/**
 * 递归获取所有父节点
 * @param key 节点key
 * @param treeData ant树型数据
 */
export const getAntTreeParents = (key, treeData) => {
  const res: any = [];
  // 获取节点
  const node = getAntTreeNode(key, treeData);
  if (!node) return res;
  // 先添加父
  res.push(...getAntTreeParents(node.pid, treeData));
  // 后添加子
  res.push(node);
  return res;
};

export const findNodeById = (data, id) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      return data[i];
    }
    if (data[i].children && data[i].children.length > 0) {
      const foundInChildren = findNodeById(data[i].children, id);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  return null; // 如果没找到，则返回null
};
