/* eslint-disable */

/*
* 替换字符串 */
export function replaceStr(str, reg, newStr) {
  if (!str) return '';
  return str.replace(new RegExp(reg, 'g'), (match) => newStr);
}

// eslint-disable-next-line consistent-return
export function brightenKeywords(str, keyword) {
  const Reg = new RegExp(keyword, 'i');
  if (str) {
    return str.replace(Reg, `<span style="color: #CC4F47;">${keyword}</span>`);
  }
}

export function hasDuplicate(arr, value) {
  const duplicateIndex = arr.findIndex((obj) => obj.name === value);
  if (duplicateIndex !== -1) {
    // eslint-disable-next-line no-param-reassign
    arr[duplicateIndex].id = new Date().getTime();
    arr.sort((a, b) => b.id - a.id);
  } else {
    arr.unshift({
      id: new Date().getTime(),
      name: value
    });
  }
  return arr;
}

// base64转换为blob
export function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

//  blob转换为file
export function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();  // 文件最后的修改日期
  theBlob.name = fileName;                // 文件名
  return new File([theBlob], fileName, { type: theBlob.type, lastModified: Date.now() });
}

export function findPathByPropValue(tree, prop, value, vprop, path) {
  if (typeof path === 'undefined') {
    path = []
  }
  for (var i = 0; i < tree.length; i++) {
    var tempPath = [...path]
    tempPath.push(tree[i][vprop])
    if (tree[i][prop] === value) {
      return tempPath
    }
    if (tree[i].children) {
      const reuslt = findPathByPropValue(tree[i].children, prop, value, vprop, tempPath)
      if (reuslt) {
        return reuslt
      }
    }
  }
}

export function findRegionPath(tree, level, path) {
  if (typeof path === 'undefined') {
    path = []
  }
  for (var i = 0; i < tree.length; i++) {
    var tempPath = [...path]
    tempPath.push(tree[i])
    if (!tree[i].disabled && tree[i].regionLevel === level) {
      return tempPath
    }
    if (tree[i].regionLevel < level && tree[i].children) {
      const reuslt = findRegionPath(tree[i].children, level, tempPath)
      if (reuslt) {
        return reuslt
      }
    }
  }
}

export function findRegionPathByCode(tree, code, path) {
  if (typeof path === 'undefined') {
    path = []
  }
  for (var i = 0; i < tree.length; i++) {
    var tempPath = [...path]
    tempPath.push(tree[i])
    if (!tree[i].disabled && tree[i].regionCode === code) {
      return tempPath
    }
    if (tree[i].children) {
      const reuslt = findRegionPathByCode(tree[i].children, code, tempPath)
      if (reuslt) {
        return reuslt
      }
    }
  }
}

export function traverseTree(node, callback) {
  callback(node)
  if (node.children && node.children.length) {
    node.children.forEach(child => {
      traverseTree(child, callback)
    })
  }
}

export function findNodeByDFS(root, callback) {
  let result = null
  traverseTree(root, node => {
    if (callback(node)) {
      result = node
    }
  })
  return result
}

export function isNumber(num) {
  return num !== '' && typeof Number(num) === 'number' && !isNaN(Number(num))
}

export function thousands(num) {
  if (!isNumber(num)) return '--'
  return Number(num).toLocaleString();
}

export function formatUnit(unit) {
  return !unit ? '' : `(${unit})`
}

export function getLevelByCode(code) {
  return code === 'china' ? 0 : code.substr(2, 4) === '0000' ? 1 : code.substr(4, 2) === '00' ? 2 : 3;
}

export function getRowIndex(index, curPage, pageSize) {
  return (curPage - 1) * pageSize + index + 1;
}

export function resizeChart(compInst) {
  const { $refs = {}, chartAmount = 0 } = compInst
  for (let i = 0; i <= chartAmount; i++) {
    if ($refs[`chart${i}`]) {
      // console.log(`chart${i}`, $refs[`chart${i}`])
      if (Array.isArray($refs[`chart${i}`])) {
        $refs[`chart${i}`].forEach(element => {
          element.chart && element.chart.resize();
        });
      } else {
        if ($refs[`chart${i}`].chart)
          $refs[`chart${i}`].chart.resize();
      }
    }
  }
}
