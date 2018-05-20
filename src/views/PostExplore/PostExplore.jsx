import React, { Component } from 'react';
import { PostCard, ItemGrid } from 'components';
import { Grid, Input, Button, Radio, RadioGroup, FormControlLabel } from 'material-ui';
import { postActions, commentActions } from 'actions';
import { connect } from 'react-redux';
import { authHeader, getCurrentUsername } from '../../utils';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import ImagesUploader from 'react-images-uploader';
import 'react-images-uploader/styles.css';
import 'react-images-uploader/font.css';
import env from 'env';

class PostExplore extends Component {
  state = {createType: 'status', disablePost: false, caption: "", openImageUpload: false, rows: 1, disableSubmit: false, image_names:[]}
  handleSubmitComment = (cmt) => {
    this.props.submitComment(cmt)
  }
  handleSubmitUpdatePost = (post) => {
    this.props.updatePost(post)
  }
  handleDeletePost = (id) => {
    this.props.delete(id)
  }

  handleSubmitPost = () => {
    const hashtags = this._findHashtags(this.state.caption);
    const { caption, createType } = this.state;
    const image_names = this.state.image_names;
    console.log({caption, type: createType, hashtags, image_names})
    this.props.create({caption, type: createType, hashtags, image_names});
    this.setState({caption: ''})
    window.location.reload()
  }

  handlePostChange = (e) => {
    if (e.target.value === '' || e.target.value === null || e.target.value === 'undefined'){
      this.setState({caption: e.target.value})
    } else {
      this.setState({caption: e.target.value})
    }
  }

  componentWillMount() {
    this.props.getAll(1)
  }

  _findHashtags(caption) {
    var hashtags = [];
    for (var i = 0; i < caption.length; i++) {
      if (caption[i] === '#') {
        console.log(i)
        var hashtag='';
        for (var j = i+1; j < caption.length; j++) {
          if (j === caption.length-1) {
            if (caption[j] === ' '){
              return hashtags;
            }
            hashtag+=caption[j];
            hashtags.push(hashtag);
            return hashtags;
          }

          if (caption[j] === ' ') {
            if (j === i + 1) {
              i = j + 1;
              break;
            }
            i = j + 1;
            hashtags.push(hashtag);
            break;
          }
          hashtag+=caption[j];
        }
      }
    }
    return hashtags;
  }

  render() {
    const {items} = this.props;
    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={8}>
          <Card style={{maxWidth: 600, marginTop: 10}} >
            <CardHeader
              style={{backgroundColor: '#f1f1f1'}}
              title={
                <div style={{display: 'inline-block'}}>
                  <span style={{fontWeight: 'bold', color:'#365899'}}>Write your post</span>
                  <RadioGroup
                    style={{display: 'inline-block', marginLeft: 70}}
                    value={this.state.createType}
                    onChange={(e) => {this.setState({createType: e.target.value});}}
                  >
                    <FormControlLabel value="status" control={<Radio />} label="Status" />
                    <FormControlLabel value="talent-wanted" control={<Radio />} label="Talent Wanted" />
                  </RadioGroup>
                </div>
              }
            />
            <CardContent>
              <Input
                style={{marginBottom: 50}}
                fullWidth
                rows={this.state.rows}
                multiline
                disabled={this.state.disablePost}
                placeholder={"What's on your mind," + getCurrentUsername() + "?"}
                onChange={this.handlePostChange}
                onFocus={()=>{this.setState({openImageUpload: true, rows: 5})}}
                onBlur={()=>{this.setState({rows: 1})}}
              />
              {
                this.state.openImageUpload &&
                <ImagesUploader
                optimisticPreviews={true}
                multiple={true}
                inputId="image_files"
                url={env.url+"/posts/images"}
                headers= {authHeader()}
                onLoadStart={()=>{this.setState({disablePost:true, disableSubmit: true})}}
                onLoadEnd={(err, resp) => {
                    if (err) {
                        console.error(err);
                        return
                    }
                    let imageNames = []
                    resp.map((url, index)=>{
                      return imageNames[index] = url.replace(env.s3Endpoint,"")
                    })
                    this.setState({disablePost:false, disableSubmit: false, image_names: imageNames})
                }}
                deleteImage={
                  (index)=> {
                    let images = this.state.image_names.splice(index,1)
                    if (images.length === 0) {
                      this.setState({image_names: [], disableSubmit: true})
                    } else {
                      this.setState({image_names: [], disableSubmit: false})
                    }
                  }
                }
                label="Upload multiple images"
              />
              }
              {
                ((this.state.caption !== '') || (this.state.image_names.length !== 0))&&
                <Button
                  fullWidth
                  color="primary"
                  disabled={((this.state.caption.length === 0) && (this.state.image_names.length === 0)) || this.state.disableSubmit}
                  onClick={this.handleSubmitPost}
                >
                Post
                </Button>
              }
            </CardContent>
          </Card>
          {
            items.map(post => {
              return (
              post.type === 'status' &&
              <PostCard
                key={post.id}
                postID={post.id}
                user={post.user}
                star={post.star_flag}
                starCount={post.star_count}
                postDate={new Date(post.created_at)}
                content={post.caption}
                mediaImages={post.image_urls}
                comments={post.comments}
                onSubmitComment={this.handleSubmitComment}
                onSubmitUpdatePost={this.handleSubmitUpdatePost}
                onSubmitDeletePost={this.handleDeletePost}
              />
              );
            })
          }
        </ItemGrid>
        <ItemGrid xs={12} sm={12} md={4}>
        <CardHeader
          style={{marginTop:10}}
          title={<span style={{fontWeight: 'bold', color:'#365899'}}>Talent Wanted</span>}
        />
        {
          items.map(post => {
            return (
              post.type === 'talent-wanted' &&
              <PostCard
                key={post.id}
                postID={post.id}
                star={post.star_flag}
                starCount={post.star_count}
                user={{id: 1, user_name: 'congthinh', first_name: 'Thịnh', last_name: 'Hoàng'}}
                postDate={new Date("2018-05-17")}
                content={"Cần 1 hậu vệ cánh trái cho trận giao hữu Khóa 12 và khóa 08 Hội Sv điện dương"}
                // mediaImages={post.image_urls}
                comments={[]}
                onSubmitComment={this.handleSubmitComment}
                onSubmitUpdatePost={this.handleSubmitUpdatePost}
                onSubmitDeletePost={this.handleDeletePost}
              />
            )
          })
        }
        </ItemGrid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  const {items} = state.posts;
  return { items }
}

export default connect(mapStateToProps, {
  submitComment: commentActions.create,
  updatePost: postActions.update,
  uploadImages: postActions.uploadImages,
  create: postActions.create,
  getAll: postActions.getAll,
  delete: postActions.delete
})(PostExplore);