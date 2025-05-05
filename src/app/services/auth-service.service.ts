import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private API_SERVER = "http://localhost:8080/alpaca/accounts/create"

  private API_SERVER_LOGIN = "http://localhost:8080/user/check"
  
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  login(credentiasl: {email: string, password: string}): Observable<any> {
    const params = new HttpParams()
    .set('email',credentiasl.email)
    .set('password',credentiasl.password);

    return this.http.get(this.API_SERVER_LOGIN, {params});
  }

  registerUser(formData: any): Observable<any> {
     const userData = {
      "contact": {
        "email_address": formData.email,
        "phone_number": formData.phone,
        "street_address": [formData.address],
        "city": formData.city,
        "postal_code": formData.postalCode,
        "state": ""
      },
      "identity": {
        "given_name": formData.firstName,
        "family_name": formData.lastName,
        "date_of_birth": formData.birthDate,
        "tax_id_type": "COL_CC",
        "tax_id": "1021392516",
        "country_of_citizenship": "COL",
        "country_of_birth": "COL",
        "country_of_tax_residence": "COL",
        "funding_source": [formData.funding_source],
        "annual_income_min": formData.annual_income_min,
        "annual_income_max": formData.annual_income_max,
        "total_net_worth_min": formData.total_net_worth_min,
        "total_net_worth_max": formData.total_net_worth_max,
        "liquid_net_worth_min": formData.liquid_net_worth_min,
        "liquid_net_worth_max": formData.liquid_net_worth_max,
        "liquidity_needs": "does_not_matter",
        "investment_experience_with_stocks": "over_5_years",
        "investment_experience_with_options": "over_5_years",
        "risk_tolerance": "conservative",
        "investment_objective": "market_speculation",
        "investment_time_horizon": "more_than_10_years",
        "marital_status": "MARRIED",
        "number_of_dependents": 5
      },
      "disclosures": {
        "is_control_person": false,
        "is_affiliated_exchange_or_finra": false,
        "is_affiliated_exchange_or_iiroc": false,
        "is_politically_exposed": false,
        "immediate_family_exposed": false
      },
      "agreements": [
        {
          "agreement": "customer_agreement",
          "signed_at": "2024-08-27T10:39:34+01:00",
          "ip_address": "185.11.11.11"
        },
        {
          "agreement": "margin_agreement",
          "signed_at": "2020-09-11T18:09:33Z",
          "ip_address": "185.13.21.99"
        }
      ],
      "documents": [
        {
          "document_type": "identity_verification",
          "document_sub_type": "passport",
          "content": "/9j/Cg==",
          "mime_type": "image/jpeg"
        }
      ],
      "trusted_contact": {
        "given_name": "xyz",
        "family_name": "wyz",
        "email_address": ""
      },
      "additional_information": "",
      "account_type": ""
    };
  
    console.log('Datos completos a enviar:', JSON.stringify(userData, null, 2));
    return this.http.post(this.API_SERVER, userData);
  }
}
