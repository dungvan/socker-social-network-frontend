
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MatchCard, ItemGrid, TeamCard } from 'components';
import { Grid, Card } from "@material-ui/core";
import { matchActions } from 'actions';

class MatchProfile extends Component {
	state = {team1: null, team2: null}
	componentWillMount() {
		this.props.getByUserName(this.props.match.params.username)
	}
	handleShowTeamName = (index) => {
    let {team1, team2} = this.props.items[index]
    this.setState({team1, team2})
  }
	render () {
    console.log(this.props)
		const { items } = this.props;
    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
        <Card>
        </Card>
        </ItemGrid>
        <ItemGrid xs={12} sm={12} md={4}>
          {items.map((match, index) => {
            return (
              <MatchCard
                history={this.props.history}
                key={match.id}
                matchID={match.id}
                user={match.master}
                title={match.description}
                date={new Date(match.start_date)}
                tournament={match.tournament}
                team={{1: match.team1, 2:match.team2}}
                goals={{1: match.team1_goals, 2: match.team2_goals}}
                onClick={this.handleShowTeamName.bind(this, index)}
              />
            );
          })}
        </ItemGrid>
        <ItemGrid xs={12} sm={12} md={8} style={{position: "relative"}}>
          <div style={{display: "flex", position: 'fixed'}}>
            <ItemGrid xs={12} sm={12} md={6}>
            {this.state.team1 &&
              <TeamCard
                history={this.props.history}
                team={this.state.team1}
              />
            }
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={6}>
            {this.state.team2 &&
              <TeamCard
                history={this.props.history}
                team={this.state.team2}
              />
            }
            </ItemGrid>
          </div>
        </ItemGrid>
      </Grid>
    );
	}
}

const mapStateToProps = (state) => {
	const { items } = state.matches;
	return {items}
}

export default connect(mapStateToProps, {
	getByUserName: matchActions.getByUserName
})(MatchProfile)