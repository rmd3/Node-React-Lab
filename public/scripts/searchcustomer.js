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
    componentDidMount: function () {
        this.loadCustomerFromServer();
       // setInterval(this.loadCustomerFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <h1>Customer</h1>
                <Customerform2 onCustomerSubmit={this.loadCustomerFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Zip</th>
                                <th>Credit</th>
                                <th>Email</th>
                                <th>Member</th>
                                <th>Reward</th>
                            </tr>
                         </thead>
                        <CustomerList data={this.state.data} />
                    </table>
                
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
                this.setState({ data: data })
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        })
    },
    componentDidMount: function () {
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
                    custaddress={customer.dbcustomeraddress}
                    custzip={customer.dbcustomerzip}
                    custcredit={customer.dbcustomercredit}
                    custemail={customer.dbcustomeremail}
                    cmember={customer.dbcustomermember}
                    custreward={customer.dbcustrewardname}
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
                                {this.props.custaddress}
                            </td>
                            <td>
                                {this.props.custzip}
                            </td>
                            <td>
                                {this.props.custcredit}
                            </td>
                            <td>
                                {this.props.custemail}
                            </td>
                            <td>
                                {themember}
                            </td>
                            <td>
                                {this.props.custreward}
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
                    key={custReward.dbcustrewardid}
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

ReactDOM.render(
    <CustomerBox />,
    document.getElementById('content')
);

