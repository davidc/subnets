var curNetwork = 0;
var curMask = 0;

function updateNetwork()
{
  var newNetworkStr = document.forms['calc'].elements['network'].value;
  var newMask = parseInt(document.forms['calc'].elements['netbits'].value);

  var newNetwork = inet_aton(newNetworkStr);

  if (newNetwork === null) {
    alert('Invalid network address entered');
    return;
  }

  var tmpNetwork = network_address(newNetwork, newMask);
  if (newNetwork != tmpNetwork) {
    alert('The network address entered is not on a network boundary for this mask.\nIt has been changed to '+inet_ntoa(tmpNetwork)+'.');
    newNetwork = tmpNetwork;
    document.forms['calc'].elements['network'].value = inet_ntoa(tmpNetwork);
  }

  if (newMask < 0 || newMask > 32) {
    alert('The network mask you have entered is invalid');
    return;
  }

  if (curMask == 0) {
    curMask = newMask;
    curNetwork = newNetwork;
    startOver();
  }
  else if (curMask != newMask && confirm('You are changing the base network from /'+curMask+' to /'+newMask+'. This will reset any changes you have made. Proceed?')) {
    curMask = newMask;
    curNetwork = newNetwork;

    startOver();
  }
  else {
    document.forms['calc'].elements['netbits'].value = curMask;
    curNetwork = newNetwork;

    recreateTables();
  }
}

function startOver()
{
  rootSubnet = [0, 0, null];

  recreateTables();
}

function recreateTables()
{
  var calcbody = document.getElementById('calcbody');
  if (!calcbody) {
    alert('Body not found');
    return;
  }

  while (calcbody.hasChildNodes()) {
    calcbody.removeChild(calcbody.firstChild);
  }

  updateNumChildren(rootSubnet);
  updateDepthChildren(rootSubnet);

  createRow(calcbody, rootSubnet, curNetwork, curMask, [curMask, rootSubnet[1], rootSubnet], rootSubnet[0]);

  document.getElementById('joinHeader').colSpan = (rootSubnet[0] > 0 ? rootSubnet[0] : 1);
  document.getElementById('col_join').span = (rootSubnet[0] > 0 ? rootSubnet[0] : 1);

  /* Create the bookmark hyperlink */
  var link = document.getElementById('saveLink');
  if (link) {
    link.href = 'index.html?network='+inet_ntoa(curNetwork)+'&mask='+curMask+'&division='+binToAscii(nodeToString(rootSubnet));
  }
}

function nodeToString(node)
{
  if (node[2]) {
    return '1'+nodeToString(node[2][0])+nodeToString(node[2][1]);
  }
  else {
    return '0';
  }
}

function binToAscii(str)
{
  var curOut = '';
  var curBit = 0;
  var curChar = 0;

  for (var i=0; i<str.length; i++) {
    if (str.charAt(i) == '1') {
      curChar |= 1<<curBit;
    }
    curBit++;
    if (curBit > 3) {
      curOut += curChar.toString(16);
      curChar = 0;
      curBit = 0;
    }
  }
  if (curBit > 0) {
    curOut += curChar.toString(16);
  }
  return str.length+'.'+curOut;
}

function asciiToBin(str)
{
  var re = /([0-9]+)\.([0-9a-f]+)/;
  var res = re.exec(str);
  var len = res[1];
  var encoded = res[2];
  var out = '';
  for (var i=0; i< res[1]; i++) {
    var ch = parseInt(res[2].charAt(Math.floor(i/4)), 16);
    var pos = i % 4;
    out += (ch & (1<<pos) ? '1' : '0');
  }
  return out;
}

function createRow(calcbody, node, address, mask, labels, depth)
{
  if (node[2]) {
    var newlabels = labels;
    newlabels.push(mask+1);
    newlabels.push(node[2][0][1]);
    newlabels.push(node[2][0]);
    createRow(calcbody, node[2][0], address, mask+1, newlabels, depth-1);

    newlabels = new Array();
    newlabels.push(mask+1);
    newlabels.push(node[2][1][1]);
    newlabels.push(node[2][1]);
    createRow(calcbody, node[2][1], address+subnet_addresses(mask+1), mask+1, newlabels, depth-1);
  }
  else {
    var newRow = document.createElement('TR');
    calcbody.appendChild(newRow);

    /* subnet address */
    var newCell = document.createElement('TD');
    newCell.appendChild(document.createTextNode(inet_ntoa(address)+'/'+mask));
    newRow.appendChild(newCell);

    var addressFirst = address;
    var addressLast = subnet_last_address(address, mask);
    var useableFirst = address + 1;
    var useableLast = addressLast - 1;
    var numHosts;
    var addressRange;
    var usaebleRange;

    if (mask == 32) {
      addressRange = inet_ntoa(addressFirst);
      useableRange = addressRange;
      numHosts = 1;
    }
    else {
      addressRange = inet_ntoa(addressFirst)+' - '+inet_ntoa(addressLast);
      if (mask == 31) {
    useableRange = addressRange;
    numHosts = 2;
      }
      else {
    useableRange = inet_ntoa(useableFirst)+' - '+inet_ntoa(useableLast);
    numHosts = (1 + useableLast - useableFirst);
      }
    }

    /* netmask */
    var newCell = document.createElement('TD');
    newCell.appendChild(document.createTextNode(inet_ntoa(subnet_netmask(mask))));
    newRow.appendChild(newCell);

    /* range of addresses */
    var newCell = document.createElement('TD');
    newCell.appendChild(document.createTextNode(addressRange));
    newRow.appendChild(newCell);

    /* useable addresses */
    var newCell = document.createElement('TD');
    newCell.appendChild(document.createTextNode(useableRange));
    newRow.appendChild(newCell);

    /* Hosts */
    var newCell = document.createElement('TD');
    newCell.appendChild(document.createTextNode(numHosts));
    newRow.appendChild(newCell);

    /* actions */

    var newCell = document.createElement('TD');
    newRow.appendChild(newCell);

    if (mask == 32) {
      var newLink = document.createElement('SPAN');
      newLink.className = 'disabledAction';
      newLink.appendChild(document.createTextNode('Divide'));
      newCell.appendChild(newLink);
    }
    else {
      var newLink = document.createElement('A');
      newLink.href = '#';
      newLink.onclick = function () { divide(node); return false; }
      newLink.appendChild(document.createTextNode('Divide'));
      newCell.appendChild(newLink);
    }

    var colspan = depth - node[0];

    for (var i=(labels.length/3)-1; i>=0; i--) {
      var mask = labels[i*3];
      var rowspan = labels[(i*3)+1];
      var joinnode = labels[(i*3)+2];

      var newCell = document.createElement('TD');
      newCell.rowSpan = (rowspan > 1 ? rowspan : 1);
      newCell.colSpan = (colspan > 1 ? colspan : 1);

      if (i == (labels.length/3)-1) {
    newCell.className = 'maskSpan';
      }
      else {
    newCell.className = 'maskSpanJoinable';
    newCell.onclick = newJoin(joinnode);
    //  newCell.onmouseover = function() { window.status = joinnode[0]+'---'+joinnode[1]+'---'+joinnode[2]+'>>>>>'+node[2];}
      }

      var newImg = document.createElement('IMG');
      newImg.src = 'img/'+mask+'.png';
      newCell.appendChild(newImg);
      newRow.appendChild(newCell);

      colspan = 1; // reset for subsequent cells
    }
  }

}

/* This is necessary because 'joinnode' changes during the scope of the caller */
function newJoin(joinnode)
{
  return function() { join(joinnode) };
}

function divide(node)
{
  node[2] = new Array();
  node[2][0] = [0, 0, null];
  node[2][1] = [0, 0, null];
  recreateTables();
}

function join(node)
{
  /* easy as pie */
  node[2] = null;
  recreateTables();
}

function updateNumChildren(node)
{
  if (node[2] == null) {
    node[1] = 0;
    return 1;
  }
  else {
    node[1] = updateNumChildren(node[2][0]) + updateNumChildren(node[2][1]);
    return node[1];
  }
}

function updateDepthChildren(node)
{
  if (node[2] == null) {
    node[0] = 0;
    return 1;
  }
  else {
    node[0] = updateDepthChildren(node[2][0]) + updateDepthChildren(node[2][1]);
    return node[1];
  }
}


var rootSubnet;

// each node is Array:
// [0] => depth of children, total number of visible children, children


function inet_ntoa(addrint)
{
  return ((addrint >> 24) & 0xff)+'.'+
    ((addrint >> 16) & 0xff)+'.'+
    ((addrint >> 8) & 0xff)+'.'+
    (addrint & 0xff);
}

function inet_aton(addrstr)
{
  var re = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/;
  var res = re.exec(addrstr);

  if (res === null) {
    return null;
  }

  for (var i=1; i<=4; i++) {
    if (res[i] < 0 || res[i] > 255) {
      return null;
    }
  }

  return (res[1] << 24) | (res[2] << 16) | (res[3] << 8) | res[4];
}

function network_address(ip, mask)
{
  var maskbits = 0;
  for (var i=31-mask; i>=0; i--) {
    ip &= ~ 1<<i;
  }
  return ip;
}

function subnet_addresses(mask)
{
  return 1<<(32-mask);
}

function subnet_last_address(subnet, mask)
{
  return subnet + subnet_addresses(mask) - 1;
}

function subnet_netmask(mask)
{
  return network_address(0xffffffff, mask);
}


function preloadSubnetImages()
{
  if (document.images) {
    if (!document.preloadedImages) {
      document.preloadedImages = new Array();
    }

    for (var i=0; i<=32; i++) {
      var img = new Image();
      img.src = 'img/'+i+'.png';
      document.preloadedImages.push(img);
    }
  }
}


function calcOnLoad()
{
  preloadSubnetImages();
  args = parseQueryString();
  if (args['network'] && args['mask'] && args['division']) {
    document.forms['calc'].elements['network'].value = args['network'];
    document.forms['calc'].elements['netbits'].value = args['mask'];
    updateNetwork();
    var division = asciiToBin(args['division']);
    rootSubnet = [0, 0, null];
    if (division != '0') {
      loadNode(rootSubnet, division);
    }
    recreateTables();
  }
  else {
    updateNetwork();
  }
}

function loadNode(curNode, division)
{
  if (division.charAt(0) == '0') {
    return division.substr(1);
  }
  else {
    curNode[2] = new Array();
    curNode[2][0] = [0, 0, null];
    curNode[2][1] = [0, 0, null];

    division = loadNode(curNode[2][0], division.substr(1));
    division = loadNode(curNode[2][1], division);
    return division;
  }
}


function parseQueryString (str)
{
  str = str ? str : location.search;
  var query = str.charAt(0) == '?' ? str.substring(1) : str;
  var args = new Object();
  if (query) {
    var fields = query.split('&');
    for (var f = 0; f < fields.length; f++) {
      var field = fields[f].split('=');
      args[unescape(field[0].replace(/\+/g, ' '))] = 
    unescape(field[1].replace(/\+/g, ' '));
    }
  }
  return args;
}
