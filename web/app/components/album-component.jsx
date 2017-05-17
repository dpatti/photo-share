// @flow
import React from 'react';
import {Upload} from 'app/models/upload';
import {OptionsComponent} from 'app/components/options-component';
import {UploadCollectionComponent} from 'app/components/upload-collection-component';

export class AlbumComponent extends React.Component {
  props: {
    auth: string,
  };

  state: {
    loaded: Array<Upload>,
    hasMore: boolean,
  };

  constructor() {
    super();
    this.state = {
      loaded: [],
      hasMore: true,
    };
  }

  componentWillMount() {
    this.loadMore();
  }

  loadMore() {
    fetch(`/uploads?from=${this.state.loaded.length}`, {
      headers: new Headers({
        authorization: `Bearer ${this.props.auth}`,
      })
    }).then(response =>
      (response.ok)
        ? response.json()
        : response.text().then(message => Promise.reject(Error(message)))
    ).then(uploads => {
      this.setState({
        loaded: this.state.loaded.concat(uploads),
        hasMore: uploads.length > 0,
      });
    });
  }

  render() {
    return (
      <div className='album'>
        <OptionsComponent auth={this.props.auth} />
        <UploadCollectionComponent uploads={this.state.loaded} />
        {
          this.state.hasMore
            ? <button onClick={_ => this.loadMore()}>Load more</button>
            : null
        }
      </div>
    );
  }
}
