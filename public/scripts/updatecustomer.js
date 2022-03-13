var CustomerBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadCustomerFromServer: function () {

        var cmembervalue = 2;
        if (cmemberdis.checked) {
            cmembervalue = 1;
        } 
        if (cmemberstn.checked) {
            cmembervalue = 0;
        }
        console.log(cmembervalue);
        $.ajax({
            url: '/getcust',
            data: {
                'customername': customername.value,
                'customeraddress': customeraddress.value,
                'customerzip': customerzip.value,
                'customercredit': customercredit.value,
                'customeremail': customeremail.value,
                'customermember': cmembervalue,
                'customerreward': custreward.value
            },
            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    updateSingleCustFromServer: function (customer) {
        
        $.ajax({
            url: '/updatesinglecust',
            dataType: 'json',
            data: customer,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    componentDidMount: function () {
        this.loadCustomerFromServer();
       // setInterval(this.loadCustomerFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <h1>Update Customer</h1>
                <Customerform2 onCustomerSubmit={this.loadCustomerFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                         </thead>
                        <CustomerList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <CustomerUpdateform onUpdateSubmit={this.updateSingleCustFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Customerform2 = React.createClass({
    getInitialState: function () {
        return {
            customername: "",
            customeraddress: "",
            customerzip: "",
            customercredit: "",
            customeremail: "",
            customerMember: "",
            data: []
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadCustReward: function () {
        $.ajax({
            url: '/getcustreward',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadCustReward();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var customername = this.state.customername.trim();
        var customeraddress = this.state.customeraddress.trim();
        var customerzip = this.state.customerzip.trim();
        var customercredit = this.state.customercredit.trim();
        var customeremail = this.state.customeremail.trim();
        var customermember = this.state.selectedOption;
        var customerreward = custreward.value;

        this.props.onCustomerSubmit({ 
            customername: customername, 
            customeraddress: customeraddress, 
            customerzip: customerzip, 
            customercredit: customercredit, 
            customeremail: customeremail,
            customermember: customermember,
            customerreward: customerreward 
        });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
        <div>
            <div id = "theform">
            <form onSubmit={this.handleSubmit}>
            <h2>Customer</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Customer Name</th>
                            <td>
                                <input name="customername" id="customername" value={this.state.customername} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Address</th>
                            <td>
                                <input name="customeraddress" id="customeraddress" value={this.state.customeraddress} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Zip</th>
                            <td>
                                <input name="customerzip" id="customerzip" value={this.state.customerzip} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Credit</th>
                            <td>
                                <input name="customercredit" id="customercredit" value={this.state.customercredit} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Email</th>
                            <td>
                                <input name="customeremail" id="customeremail" value={this.state.customeremail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Membership</th>
                            <td>
                                <input 
                                type="radio"
                                name="cmember"
                                id="cmemberdis" 
                                value="1" 
                                checked={this.state.selectedOption === "1"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                                />Discount
                                <input 
                                type="radio"
                                name="cmember"
                                id="cmemberstn" 
                                value="0" 
                                checked={this.state.selectedOption === "0"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                                />Standard
                            </td>
                        </tr> 
                        <tr>
                            <th>Customer Reward</th>
                            <td>
                                <SelectList data={this.state.data} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Customer" />

            </form>
            </div>
            <div>
                    <br />
                    <form onSubmit={this.getInitialState}>
                        <input type="submit" value="Clear Form" />
                    </form>
            </div>
        </div>
        );
    }
});

var CustomerUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upcustomerid: "",
            upcustomername: "",
            upcustomeraddress: "",
            upcustomerzip: "",
            upcustomercredit: "",
            upcustomeremail: "",
            upcustomerMember: "",
            upselectedOption: "",
            updata: []
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    loadCustReward: function () {
        $.ajax({
            url: '/getcustreward',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ updata: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadCustReward();

    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upcustomerid = upcustid.value;
        var upcustomername = upcustname.value;
        var upcustomeraddress = upcustaddress.value;
        var upcustomerzip = upcustzip.value;
        var upcustomercredit = upcustcredit.value;
        var upcustomeremail = upcustemail.value;
        var upcustomermember = this.state.upselectedOption;
        var upcustomerreward = upcustreward.value;

        this.props.onUpdateSubmit({
            upcustomerid: upcustomerid,
            upcustomername: upcustomername,
            upcustomeraddress: upcustomeraddress,
            upcustomerzip: upcustomerzip,
            upcustomercredit: upcustomercredit,
            upcustomeremail: upcustomeremail,
            upcustomermember: upcustomermember,
            upcustomerreward: upcustomerreward
        });
    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <div>
                <div id="theform">
                    <form onSubmit={this.handleUpSubmit}>

                        <table>
                            <tbody>
    <tr>
        <th>Customer Name</th>
        <td>
<input name="upcustname" id="upcustname" value={this.state.upcustname} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Customer Address</th>
        <td>
<input name="upcustaddress" id="upcustaddress" value={this.state.upcustaddress} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Customer Zip</th>
        <td>
<input name="upcustzip" id="upcustzip" value={this.state.upcustzip} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Customer Credit</th>
        <td>
<input name="upcustcredit" id="upcustcredit" value={this.state.upcustcredit} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Customer Email</th>
        <td>
<input name="upcustemail" id="upcustemail" value={this.state.upcustemail} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>
            Customer Membership
        </th>
        <td>
            <input
                type="radio"
                name="upcustmember"
                id="upcustmemberdis"
                value="1"
                checked={this.state.upselectedOption === "1"}
                onChange={this.handleUpOptionChange}
                className="form-check-input"
            />Discount
                <input
                type="radio"
                name="upcustmember"
                id="upcustmemberstn"
                value="0"
                checked={this.state.upselectedOption === "0"}
                onChange={this.handleUpOptionChange}
                className="form-check-input"
            />Standard
        </td>
    </tr>
    <tr>
        <th>
            Customer Reward
        </th>
        <td>
            <SelectUpdateList data={this.state.updata} />
        </td>
    </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="upcustid" id="upcustid" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Customer" />
                    </form>
                </div>
            </div>
        );
    }
});

var CustomerList = React.createClass({
    render: function () {
        var customerNodes = this.props.data.map(function (customer) {
            return (
                <Customer
                    id={customer.dbcustomerid}
                    custid={customer.dbcustomerid}
                    custname={customer.dbcustomername}
                    custemail={customer.dbcustomeremail}
                >
                </Customer>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {customerNodes}
            </tbody>
        );
    }
});

var Customer = React.createClass({
    getInitialState: function () {
        return {
            upcustid: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupcustid = this.props.custid;
        
        this.loadSingleCust(theupcustid);
    },
    loadSingleCust: function (theupcustid) {
        $.ajax({
            url: '/getsinglecust',
            data: {
                'upcustid': theupcustid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateCust = this.state.singledata.map(function (customer) {
                    upcustid.value = theupcustid;
                    upcustname.value = customer.dbcustomername;
                    upcustaddress.value = customer.dbcustomeraddress;
                    upcustzip.value = customer.dbcustomerzip;
                    upcustcredit.value = customer.dbcustomercredit;
                    upcustemail.value = customer.dbcustomeremail;
                    if (customer.dbcustomermember == 1) {
                        upcustmemberdis.checked = true;
                    } else {
                        upcustmemberstn.checked = true;
                    }
                    upcustreward.value = customer.dbcustomerreward;

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },

    render: function () {

        if (this.props.cmember == 1) {
            var themember = "Discount";
        } else {
            var themember = "Standard";
        }

        return (

            <tr>
                            <td>
                                {this.props.custid} 
                            </td>
                            <td>
                                {this.props.custname}
                            </td>
                            <td>
                                {this.props.custemail}
                            </td>
                            <td>
                                <form onSubmit={this.updateRecord}>
                                    <input type="submit" value="Update Record" />
                                </form>
                            </td>
                </tr>
        );
    }
});

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (custReward) {
            return (
                <option
                    id={custReward.dbcustrewardid}
                    value={custReward.dbcustrewardid}
                >
                    {custReward.dbcustrewardname}
                </option>
            );
        });
        return (
            <select name="custreward" id="custreward">
                <option value = "0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (custReward) {
            return (
                <option
                    id={custReward.dbcustrewardid}
                    value={custReward.dbcustrewardid}
                >
                    {custReward.dbcustrewardname}
                </option>
            );
        });
        return (
            <select name="upcustreward" id="upcustreward">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <CustomerBox />,
    document.getElementById('content')
);