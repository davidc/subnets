function inet_ntoa_4(addrint) {
    return (
        ((addrint >> 24) & 0xff) +
        "." +
        ((addrint >> 16) & 0xff) +
        "." +
        ((addrint >> 8) & 0xff) +
        "." +
        (addrint & 0xff)
    );
};

function inet_aton_4(addrstr) {
    var re = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/;
    var res = re.exec(addrstr);

    if (res === null) {
        return null;
    }

    for (var i = 1; i <= 4; i++) {
        if (res[i] < 0 || res[i] > 255) {
            return null;
        }
    }

    return (res[1] << 24) | (res[2] << 16) | (res[3] << 8) | res[4];
}

function network_address_4(ip, mask) {
    var maskbits = 0;
    for (var i = 31 - mask; i >= 0; i--) {
        ip &= ~1 << i;
    }
    return ip;
}

function subnet_addresses_4(mask) {
    return 1 << (32 - mask);
}

function subnet_first_address_useable_4(addrint) {
    return addrint + 1;
}

function subnet_last_address_useable_4(addrint) {
    return addrint - 1;
}

function subnet_last_address_4(mode, subnet, mask) {
    return subnet + subnet_addresses(mode, mask) - 1;
}

function subnet_netmask_4(mask) {
    return network_address(4, 0xffffffff, mask);
}

function num_hosts_4(useableFirst, useableLast) {
    return 1 + useableLast - useableFirst;
}
