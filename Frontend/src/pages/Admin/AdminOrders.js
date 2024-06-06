import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';
import { Select } from 'antd';

const { Option } = Select;

const AdminOrders = () => {
    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"]);
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();

    const getOrders = async () => {
        try {
            const { data } = await axios.get('/api/v1/auth/all-orders');
            setOrders(data);
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    const handleChange = async (orderId, value) => {
        try {
            console.log('orderId:', orderId, 'value:', value); // Add this line to check orderId
            const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, { status: value });
            if (data.success) {
                getOrders(); // Refresh orders after updating the status
            } else {
                console.error('Failed to update order status:', data.message);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <Layout>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>All Orders</h1>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th scope='col'>#</th>
                                <th scope='col'>Status</th>
                                <th scope='col'>Buyer ID</th>
                                <th scope='col'>Date</th>
                                <th scope='col'>Payments</th>
                                <th scope='col'>Products</th>
                            </tr>
                        </thead>
                        <tbody>
               
                            {orders.map((o, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Select
                                            bordered={false}
                                            onChange={(value) => handleChange(o.id, value)}
                                            defaultValue={o?.status}
                                        >
                                            {status.map((s, i) => (
                                                <Option key={i} value={s}>{s}</Option>
                                            ))}
                                        </Select>
                                    </td>
                                    <td>{o?.buyer}</td>
                                    <td>{moment(o?.created_at).fromNow()}</td>
                                    <td>{o?.payment ? "Success" : "Failed"}</td>
                                    <td>
                                        <ul>
                                            {o.products && JSON.parse(o.products).map((product, i) => (
                                                <li key={i}>
                                                    {product.name} - Rs.{product.price}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default AdminOrders;
