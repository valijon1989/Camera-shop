// @ts-nocheck
import React, {Component} from 'react';


class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brand:" Ford",
            model:" Mustang",
            year: 2021,
            color: "Red",
        };
    }

    changeDetails = () => {
        this.setState({
            brand: "Tesla",
            model: "Model S",
            year: 2022,
            color: "Blue",
        });
    };

componentDidMount() {
        console.log("Component mounted with initial state:", this.state);
    }
// nega foydalanamiz : backendan malumot olish uchun --> retrive data  qilib olamiz va qabul qilingan datani state ga saqlaymiz
    componentWillUnmount() {
        console.log("Component will unmount. Current state:", this.state);   
    }
      //   componentWillUnmount esa yashirishdan oldin ishlaydi, bu yerda biz komponentni o'chirishdan oldin bajarilishi kerak bo'lgan kodlarni yozamiz.
  
      componentDidUpdate() {
        console.log("Component updated. New state:", this.state);
    }
  // componentDidUpdate esa komponent yangilanganidan so'ng ishlaydi, bu yerda biz yangilangan holatni ko'rishimiz mumkin.


    
    render() {
        return (
            <div>
                <h1>My {this.state.brand}</h1>
                <p>
                    Color: {this.state.color} - Model: {this.state.model} from{" "} {this.state.year}.
                </p>
                <button type="button" onClick={this.changeDetails}>Change Details</button>
            </div>
        );
      }
    }

export default Test;