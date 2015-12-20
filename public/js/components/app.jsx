// Define Namespace
(function() {
   window.app = {};
}).call(this);


(function() {
    app.util = function(){
        console.log("hello")
    }
})(app);

var Dropdown = React.createClass({
  getInitialState: function() {
  	this.cityList = [];

    return {
      cities : '',
      selectedCity: this.props.data.defaultText
    };
  },

  componentDidMount: function() {
  	var self = this; 
    $.ajax({
    	url: self.props.data.fetchUrl,
    	success: function(data){
    		self.setState({
    			cities: data
    		});
    	}
    });
  },

  citySelectionHandler: function(e){
  	var selectedText = $(e.target).text();
  	this.setState({
  		selectedCity: selectedText
  	});
  },

  render: function() {
  	if(!this.cityList.length){
		for(var i = 0;  i < this.state.cities.length; i++ ){
  			this.cityList.push(<li key={i} onClick={this.citySelectionHandler}><a href="javascript:void(0)">{this.state.cities[i]}</a></li>);
	  	}
  	}
  	
    return (
    	<div className="dropdown">
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
                {this.state.selectedCity}
                <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
                {this.cityList}
            </ul>
        </div>
    );
  }
});

var ProviderChkBox = React.createClass({
	getInitialState: function(){
		return {
			checked: false
		};
	},
	checkBoxSelection: function(e){
		this.props.updateFilter(e);
		this.setState({checked: !this.state.checked});
	},
	componentWillReceiveProps: function(){
		//use this for setting data before render is called after initial mouning
		this.setState({
			checked: false
		});
	},
	render: function(){
		return (
			<input type="checkbox" checked={this.state.checked ? 'checked': null} onChange={this.checkBoxSelection} value={this.props.value}/>
		)
	}
});

var FilterPanel = React.createClass({
	getInitialState: function(){
		this.filterSelectedProvider = [];
		this.flightProviderArr = [];

		return null;
	},
	handleFilterPanelSelection: function(e){
		if(e.target.checked){
			this.filterSelectedProvider.push(e.target.value);
		}else{
			this.filterSelectedProvider.splice(this.filterSelectedProvider.indexOf(e.target.value), 1);

			if(!this.filterSelectedProvider.length){
				this.filterSelectedProvider = this.flightProviderArr;

				this.props.filterHandler({
					provider: this.filterSelectedProvider
				});

				this.filterSelectedProvider = []

				return false;
			}
		};

		this.props.filterHandler({
			provider: this.filterSelectedProvider
		});

		console.log(this.filterSelectedProvider);
	},
	render: function(){
		this.flightProviderArr = [];
		var providerChkGroup = [];
		this.filterSelectedProvider = [];

		for (var i = this.props.flightProviders.length - 1; i >= 0; i--) {
			if(this.flightProviderArr.indexOf(this.props.flightProviders[i]) === -1){
				this.flightProviderArr.push(this.props.flightProviders[i]);
			}
		};

		for (var i = this.flightProviderArr.length - 1; i >= 0; i--) {
			providerChkGroup.push(
				<div key={i} className="checkbox">
	  				<label>
	    				<ProviderChkBox key={i} value={this.flightProviderArr[i]} updateFilter={this.handleFilterPanelSelection}/>
	    					{this.flightProviderArr[i]}
	  					</label>
				</div>
			);
		};

		return (
			<div>
				{providerChkGroup}
			</div>
		)
	}
})


var FlightTable = React.createClass({
	getInitialState: function(){
		return {
			refreshTable: false
		};
	},
	updateTable: function(data){
		this.updatedData = data;
	},
	render: function(){
		var rows = [];

		if(this.updatedData){
			this.data = this.updatedData;
		}else{
			this.data = this.props.data;
		}

		for(var i = 0;  i < this.data.length; i++ ){
  			rows.push(
  				<tr key={i}>
	  				<td>{this.data[i].originCity + "-" + this.data[i].departureCity}</td>
					<td>{this.data[i].provider + " " + this.data[i].flightNumber}</td>
					<td>{this.data[i].duration + " hr"}</td>
					<td>{this.data[i].originTime}</td>
					<td>{"Rs. " + this.data[i].ticketPrice}</td>
				</tr>
  			);
	  	}

	  	this.updatedData = null;

		return (
			<table className="table table-hover">
				<thead>
					<tr>
				 		<th>From - To</th>
				 		<th>Flight Name</th>
				 		<th>Duration (hrs)</th>
				 		<th>Origin Time</th>
				 		<th>Price</th>

					</tr>
				</thead>
				<tbody>
						{rows}
				</tbody>
			</table>
		)
	}
})

var FlightData = React.createClass({
	getInitialState: function(){
		this.data = {};

		return {
			isData: false
		}
	},
  	updateData: function(data){
  		this.data = data;
  	},
  	filterTable: function(options){
  		console.log(options);

  		var newData = this.data.filter(function(i){
			return options.provider.indexOf(i.provider) !== -1;
		})
  		this.refs.table.updateTable(newData);
  		this.refs.table.setState({
  			refreshTable: true
  		});
  	},

	render: function(){
		var flightProviders = [];
		var panel;

		for(var i = 0;  i < this.data.length; i++ ){
			flightProviders.push(this.data[i].provider);
	  	}

		if(this.state.isData){
			
			panel = (
					<div>
						<FilterPanel ref="panel" flightProviders={flightProviders} filterHandler={this.filterTable}/>
						<FlightTable ref="table" data={this.data} />
					</div>
			)
		}

		return ( 
			<div>
				{panel}
			</div>
		)
	}
})


var BookingWindow = React.createClass({
	getInitialState: function(){
		this.originCityOption = {
			fetchUrl: "/getCityList",
			defaultText: "choose origin"
		};

		this.destinationCityOption = {
			fetchUrl: "/getCityList",
			defaultText: "choose destination"
		};

		return null;
	},

	fetchFlight: function(){
		var self = this;
		$.ajax({
    		url: '/getFlightDetails',
    		data: {
    			originCity: this.refs.originDD.state.selectedCity,
    			departureCity: this.refs.destinationDD.state.selectedCity
    		},
    		success: function(data){
	    		var data = $.parseJSON(data);

	    		if(data){
		    		self.refs.flightData.updateData(data);
		    		self.refs.flightData.setState({
	    				isData: true
		    		});
	    		}
	    	}
	    });
	},
	
	render: function(){
		return (
			<span>
				<Dropdown key="0" ref="originDD" data={this.originCityOption}/>
				<Dropdown key="1" ref="destinationDD" data={this.destinationCityOption}/>
	            <button className="btn btn-primary" onClick={this.fetchFlight} type="button">Submit</button>
	            <FlightData ref="flightData"/>
			</span>
		)
	}
});

ReactDOM.render(
  <BookingWindow/>,
  $('#wrapper')[0]
);