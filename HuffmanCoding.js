/**
 * Huffman Algorithm 
 */

function Node(char, freq, right, left, children) {
    this.name = char;
    this.freq = freq;
    this.code = '';
    this.right = right;
    this.left = left;
    this.children = children;
}

Node.prototype = {
    isLeaf: function() {
        return this.right == null && this.left == null;
    }
}

//Huffman Implementation starts here 
function HuffmanCoding() {
    this.input; 
    this.list;
    this.table;
    this.root; 
}

HuffmanCoding.prototype = {
    init: function(str) {
        this.input = str;
        this.list = this.createTable();
        this.table = this.sortObject();
        this.root = this.createTree();
        this.createCode();
        this.codes = this.getCodes();
        this.stat = this.stat();
        this.encodedMessage = this.createOutput();
    },

    // create a list of objects {name, freq}
    createTable: function() {
        var str = this.input;
        var list = {};
        for (var i = str.length - 1; i >= 0; i--) {
            char = str[i];
            if (list[char] == undefined) {
                list[char] = 1;
            } else {
                list[char] = ++list[char];
            }
        }
        return list;
    },

    // create a sorted list of objects {name, freq} descending freq
    sortObject: function() {
        var list = [];

        //add all obj {name, freq} in the list array as node object
        for (var key in this.list) {
            if (this.list.hasOwnProperty(key)) {
                list.push(new Node(key, this.list[key], null, null, null));
            }
        }

        // sort the list of nodes based on frequency ascending
        // and ascii for characters
        list.sort(function(a, b) {
            if (a.freq < b.freq) return -1;
            if (a.freq > b.freq) return 1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
        });

        return list.reverse(); 
    },

    // create the tree
    createTree: function() {
        var list = [].concat(this.table);

        if (list.length == 1) {
            var x = list.pop();
            list.push(new Node(x.name, x.freq, null, x, x))
        }

        while (list.length > 1) {
            // extract last 2 elements and make a node from them
            var x = list.pop();
            var y = list.pop();
            var parent = new Node((x.name + y.name), (x.freq + y.freq), x, y, [x, y]);
            list.push(parent);

            // sort the list of nodes based on frequency ascending
            // and ascii for characters
            list.sort(function(a, b) {
                if (a.freq < b.freq) return -1;
                if (a.freq > b.freq) return 1;
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
            });
            list = list.reverse();
        }
        return list.pop();
        //return list[0].freq;
    },

    // create the codes for each character
    createCode: function() {
        (function generating(node, s) {
            if (node == null) return;
            if (node.isLeaf()) {
                node.code = s;
                return;
            }
            generating(node.left, s + '0');
            generating(node.right, s + '1');
        })(this.root, '');
    },

    // make a list of objects {char, code}
    getCodes: function() {
        var chars = [];
        var codes = [];
        var list = {};

        //add all obj {name, freq} in the list array as node object
        for (var i = 0; i < this.table.length; i++) {
            chars.push(this.table[i].name);
            codes.push(this.table[i].code);
        }

        for (var i = 0; i < chars.length; i++) {
            list[chars[i]] = codes[i];
        }
        return [chars, codes, list];
    },

    // make a JSON object from tree
    makeJSON: function() {
        
    },

    find: function(name) {
        var list = this.table;
        for (var i = 0; i < list.length; i++) {
            if (list[i].name == name) {
                return list[i]
            }
        };
        return false;
    },

    createOutput: function() {
        var str = this.input;
        var list = [];
        for (var i = 0; i < str.length; i++) {
            var node = this.find(str[i]);
            if (node) {
                var code = node.code;
                list.push(code);
            }
        };
        return list;
    },


    stat: function() {
        var result = {
            'totalBitsUncompressed': this.input.length * 8 /* char * ASCII bit*/ ,
            'totalBitsCompressed': 0 /* Total Binary bits */
        }
        result.totalBitsCompressed = this.createOutput().join('').length;

        result['compressionRatio'] = 1 - result.totalBitsCompressed/result.totalBitsUncompressed;
        return result;
    }
}
