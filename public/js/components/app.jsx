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


var FlightData = React.createClass({
	getInitialState: function(){
		this.data = {};

		return {
			isData: false
		}
	},
  	updateTable: function(data){
  		this.data = data
  	},
	render: function(){
		var table =''; 

		var rows = [];

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

		if(this.state.isData){
			table = (
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
			);
		}


		return ( 
			<div>
				{table}
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
		    		self.refs.flightTable.updateTable(data);
		    		self.refs.flightTable.setState({
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
	            <FlightData ref="flightTable"/>
			</span>
		)
	}
});

ReactDOM.render(
  <BookingWindow/>,
  $('#wrapper')[0]
);