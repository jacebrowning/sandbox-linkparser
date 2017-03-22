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
        return html;
      }).catch((error) => {
        console.error(error)
      });
  }


function getLinksFromHTML(html, base) {
  var hrefs = [];
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, 'text/xml');
  var anchors = doc.getElementsByTagName('a');
  for (var i=0; i < anchors.length; i++) {
    var href = anchors[i].getAttribute('href');
    if (href) {
      href = href.trim();
      if (href.startsWith('#')) {
          console.log("Skipped anchor: " + href);
      } else if (href.startsWith('/')) {
        hrefs.push(base + href);
      } else {
        hrefs.push(href);
      }
    }
  }
  return hrefs;
}


class LinkForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: 'https://en.wikipedia.org/wiki/React_(JavaScript_library)', links: []};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    getHTML(this.state.value
      ).then((html) => {
        return getLinksFromHTML(html, this.state.value);
      }).then((hrefs) => {
        this.setState({links: hrefs});
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
