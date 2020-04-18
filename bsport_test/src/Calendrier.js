
import React, { Component } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dateFormat from 'dateformat';
 
class Calendrier extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            date: new Date(),
            error: null,
            isLoaded: false,
            items: [],
            }
    }
 
//mise a jour de la date
    handleChange = date => {
        this.setState ({
          date: date,
        }, () => this.getData())
      }

      componentDidMount() {
        this.getData()
      }
//Recuperation des données a partir de l'API Bsport
      getData = () => {
        const curr_date = dateFormat(this.state.date, "yyyy-mm-dd");
        fetch(`https://back.staging.bsport.io/api/v1/offer/?dates=${curr_date}&company=6`)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result.results
                //curr_date: this.props.name
              });
            },
            // Remarque : il est important de traiter les erreurs ici
            // au lieu d'utiliser un bloc catch(), pour ne pas passer à la trappe
            // des exceptions provenant de réels bugs du composant.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
    }
  
  render() { 

    const { error, isLoaded, items } = this.state;
        if (error) {
          return <div>Erreur : {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Chargement…</div>;
        } else {
          return (
            <div class="col-md-4 col-md-offset-4">
                    <Calendar className="center"
                        onChange={this.handleChange}
                        value={this.state.date}
                    />
                    <br />

                <table class="table">
                <thead class="thead-light">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Coach</th>
                    <th scope="col">Durée (minute(s))</th>
                    <th scope="col">Effectif</th>
                    </tr>
                </thead>
                <tbody>
                {items.map(item => (
                <tr key={item.id}>
                    <th scope="row"> {item.id} </th>
                    <td>{item.coach}</td>
                    <td>{item.duration_minute}</td>
                    <td>{item.effectif}</td>
                </tr>
                ))}
                </tbody>
                </table>
            </div>
          );
        }
    }
}

export default Calendrier;