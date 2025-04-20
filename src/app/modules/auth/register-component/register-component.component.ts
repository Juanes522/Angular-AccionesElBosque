import { Component } from '@angular/core';

interface Country {
  code: string;
  name: string;
}

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.css']
})
export class RegisterComponentComponent {
  isLoading = false;
  user = {
    firstName: '',
    lastName: '',
    birthDate: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    postalCode: '',
    email: '',
    password: ''
  };

  countries: Country[] = [
    {code: 'CO', name: 'Colombia'},
    {code: 'AR', name: 'Argentina'},
    {code: 'MX', name: 'México'},
    {code: 'ES', name: 'España'},
    {code: 'US', name: 'Estados Unidos'}
  ];

  citiesByCountry: { [key: string]: string[] } = {
    'CO': ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'],
    'AR': ['Buenos Aires', 'Córdoba', 'Rosario'],
    'MX': ['Ciudad de México', 'Guadalajara', 'Monterrey'],
    'ES': ['Madrid', 'Barcelona', 'Valencia'],
    'US': ['New York', 'Los Angeles', 'Chicago']
  };

  filteredCities: string[] = [];

  onCountryChange(){
    this.filteredCities = this.user.country ? this.citiesByCountry[this.user.country] : [];
    this.user.city = '';
  }

  onSubmit(){
    this.isLoading = true;
    console.log('Datos de registro:', this.user);
    setTimeout(() => {
      this.isLoading = false;
      alert('Registro exitoso');
    }, 1500);
  }
}
