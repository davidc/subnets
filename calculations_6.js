function inet_ntoa_6(addrint) {
    return "" +
        ((addrint >> 112n) & BigInt(0xffff)).toString(16) +
        ":" +
        ((addrint >> 96n) & BigInt(0xffff)).toString(16) +
        ":" +
        ((addrint >> 80n) & BigInt(0xffff)).toString(16) +
        ":" +
        ((addrint >> 64n) & BigInt(0xffff)).toString(16) +
        ":" +
        ((addrint >> 48n) & BigInt(0xffff)).toString(16) +
        ":" +
        ((addrint >> 32n) & BigInt(0xffff)).toString(16) +
        ":" +
        ((addrint >> 16n) & BigInt(0xffff)).toString(16) +
        ":" +
        (addrint & BigInt(0xffff)).toString(16);
}

function inet_aton_6(addrstr) {
    var re =
        /^([0-9a-f]{1,4})\:([0-9a-f]{1,4})\:([0-9a-f]{1,4})\:([0-9a-f]{1,4})\:([0-9a-f]{1,4})\:([0-9a-f]{1,4})\:([0-9a-f]{1,4})\:([0-9a-f]{1,4})$/;
    var res = re.exec(addrstr);

    if (res === null) {
        return null;
    }

    for (var i = 1; i <= 8; i++) {
        if (res[i] < 0 || res[i] > 0xffff) {
            return null;
        }
    }

    var r1 = BigInt(parseInt(res[1], 16)) << 112n;
    var r2 = BigInt(parseInt(res[2], 16)) << 96n;
    var r3 = BigInt(parseInt(res[3], 16)) << 80n;
    var r4 = BigInt(parseInt(res[4], 16)) << 64n;
    var r5 = BigInt(parseInt(res[5], 16)) << 48n;
    var r6 = BigInt(parseInt(res[6], 16)) << 32n;
    var r7 = BigInt(parseInt(res[7], 16)) << 16n;
    var r8 = BigInt(parseInt(res[8], 16));

    var rt = r1 | r2 | r3 | r4 | r5 | r6 | r7 | r8;

    return rt;
}

function network_address_6(ip, mask) {
    var maskbits = 0;
    for (var i = 128 - mask; i >= 0; i--) {
        ip &= ~1 << i;
    }
    return ip;
}

function subnet_addresses_6(mask) {
    return 1n << (128n - BigInt(mask));
}

function subnet_first_address_useable_6(addrint) {
    return addrint + 1n;
}

function subnet_last_address_useable_6(addrint) {
    return addrint - 1n;
}

function subnet_last_address_6(mode, subnet, mask) {
    return subnet + subnet_addresses(mode, mask) - 1n;
}

function subnet_netmask_6(mask) {
    return undefined;
}

function num_hosts_6(useableFirst, useableLast) {
    return 1n + useableLast - useableFirst;
}
