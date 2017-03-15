function LinksList(props) {
  return (
    <ul>
      {props.values.map(function(value){
        return <li><a href={value}>{value}</a></li>;
      })}
    </ul>
  )
}


function getHTML(url) {
    // TODO: retry with proxy
    return fetch('/proxy?url=' + url)
      .then(response => {
        return response.text();
      }).then((html) => {
        console.log(html);
        return html;
      }).catch((error) => {
        console.error(error)
      });
  }


class LinkForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: 'http://example.com', links: []};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    getHTML(this.state.value)
      .then((html) => {
        this.setState({links: ['a', 'b', html]});
      });
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


ReactDOM.render(<LinkForm />, document.getElementById('main'));
