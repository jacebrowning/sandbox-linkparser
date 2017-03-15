function LinksList(props) {
  return (
    <ul>
      {props.values.map(function(value){
        return <li><a href={value}>{value}</a></li>;
      })}
    </ul>
  )
}


class LinkForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: '', links: []};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.setState({links: ['a', 'b']});
    event.preventDefault();
  }

  render() {
    return (
      <div>

        <form onSubmit={this.handleSubmit}>
          <label>
            URL:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>

        <LinksList values={this.state.links} />

      </div>
    );
  }
}


ReactDOM.render(
  <LinkForm />,
  document.getElementById('main')
);
