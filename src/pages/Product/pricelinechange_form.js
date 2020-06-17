import React, {Component} from 'react'
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../components/translate';
import API from '../../components/api';
import * as Common from '../../components/common';
import Axios from 'axios';
import SessionManager from '../../components/session_manage';

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});

class Purhcaselinkechangeform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            priceLineDataArray: []
        };
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
    }

    changePriceLineData = (orderLineId) => {
        let pricelinedata = this.props.pricelinedata;
        let pricelinedataArray = [];
        pricelinedata.map((data, index)=>{
            if(data.orderLineId===orderLineId){
                if(data.checked){
                    data.checked = false
                }else{
                    data.checked = true
                }
            }
            if(data.checked){
                pricelinedataArray.push(data)
            }
            return data;
        });
        this.setState({priceLineDataArray: pricelinedataArray})
    }

    updatePriceLineData = () => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        let params = {};
        let URL = "";
        if(this.props.price_flag === 1){
            URL = API.UpdatePricePurchaseLines;
        }else if(this.props.price_flag === 2){
            URL = API.UpdatePriceSalesLines;
        }else{
            URL = API.UpdateTransportPriceLines;
        }
        this.state.priceLineDataArray.map((data, index)=>{
                params = {
                    orderlineid: data.orderLineId,
                    newprice: this.props.newprice,
                }
                Axios.post(URL, params, headers)
                .then(result => {
                    this.props.onHide();
                    this.setState({
                        priceLineDataArray: []
                    })
                })
            return data;
        })
    }

    render(){
        let pricelinedata = this.props.pricelinedata;
        let title = '';
        if(this.props.price_flag === 1){
            title = trls('Purchase');
        }else if(this.props.price_flag === 2){
            title = trls('Sales');
        }else{
            title = trls('Transporter');
        }
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive credit-history">
                    <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        {this.props.price_flag === 1 || this.props.price_flag === 2 ? (
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>{trls('Productcode')}</th>
                                    <th>{trls('Loading_Date')}</th>
                                    <th>{trls('Description')}</th>
                                    <th>{trls('Quantity')}</th>
                                    <th>{trls('Price')}</th>
                                </tr>
                            </thead>
                        ): 
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>{trls('Pricingtype')}</th>
                                    <th>{trls('Loading_Date')}</th>
                                    <th>{trls('Price')}</th>
                                </tr>
                            </thead>
                        }
                        
                        {pricelinedata && this.props.price_flag===1 && (<tbody >
                            {
                                pricelinedata.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td><input type="checkbox" onChange={()=>this.changePriceLineData(data.orderLineId)} /></td>
                                        <td>{data.ProductCode}</td>
                                        <td>{Common.formatDate(data.Loadingdate)}</td>
                                        <td>{data.ProductDescription}</td>
                                        <td>{data.PurchaseQuantity}</td>
                                        <td>{Common.formatMoney(data.PurchasePrice)}</td>
                                    </tr>
                            ))
                            }
                        </tbody>)}
                        {pricelinedata && this.props.price_flag===2 && (<tbody >
                            {
                                pricelinedata.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td><input type="checkbox" onChange={()=>this.changePriceLineData(data.orderLineId)} /></td>
                                        <td>{data.ProductCode}</td>
                                        <td>{Common.formatDate(data.Loadingdate)}</td>
                                        <td>{data.ProductDescription}</td>
                                        <td>{data.SalesQuantity}</td>
                                        <td>{Common.formatMoney(data.SalesPrice)}</td>
                                    </tr>
                            ))
                            }
                        </tbody>)}
                        {pricelinedata && this.props.price_flag===3 && (<tbody >
                            {
                                pricelinedata.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td><input type="checkbox" onChange={()=>this.changePriceLineData(data.orderLineId)} /></td>
                                        <td>{data.PricingType}</td>
                                        <td>{Common.formatDate(data.Loadingdate)}</td>
                                        <td>{Common.formatMoney(data.Price)}</td>
                                    </tr>
                            ))
                            }
                        </tbody>)}
                    </table>
                    {this.state.priceLineDataArray.length>0 ?(
                        <Button variant="primary" style={{height: 40, borderRadius: 20, float: 'right'}} onClick={()=>this.updatePriceLineData()}>{trls('Submit')}</Button>
                    ):
                        <Button variant="primary" style={{height: 40, borderRadius: 20, float: 'right'}} disabled onClick={()=>this.updatePriceLineData()}>{trls('Submit')}</Button>
                    }
                    
                </div>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Purhcaselinkechangeform);