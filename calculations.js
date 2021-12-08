function inet_ntoa(mode, addrint) {
    var fn = "inet_ntoa_" + mode;
    return window[fn](addrint);
}

function inet_aton(mode, addrint) {
    var fn = "inet_aton_" + mode;
    return window[fn](addrint);
}

function network_address(mode, addrint) {
    var fn = "network_address_" + mode;
    return window[fn](addrint);
}

function subnet_addresses(mode, addrint) {
    var fn = "subnet_addresses_" + mode;
    return window[fn](addrint);
}

function subnet_first_address_useable(mode, addrint) {
    var fn = "subnet_first_address_useable_" + mode;
    return window[fn](addrint);
}

function subnet_last_address_useable(mode, addrint) {
    var fn = "subnet_last_address_useable_" + mode;
    return window[fn](addrint);
}

function subnet_last_address(mode, subnet, mask) {
    var fn = "subnet_last_address_" + mode;
    return window[fn](mode, subnet, mask);
}

function subnet_netmask(mode, addrint) {
    var fn = "subnet_netmask_" + mode;
    return window[fn](addrint);
}

function num_hosts(mode, useableFirst, useableLast) {
    var fn = "num_hosts_" + mode;
    return window[fn](useableFirst, useableLast);
}
