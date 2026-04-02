import axios from "../../api/axios";
import { getApiUrl } from "../../lib/config";
import { CartItem } from "../../lib/types/search";
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../../lib/types/order";


class OrderService {
    public async createOrder(input: CartItem[]): Promise<Order> {
        try {
            const orderItems: OrderItemInput[] = input.map((cartItem: CartItem) => {
                return {
                    itemQuantity: cartItem.quantity,
                    itemPrice: cartItem.price,
                    productId: cartItem._id
                };
            });
            const result = await axios.post(getApiUrl("order/create"), orderItems, {
              withCredentials: true,
            });

            return result.data;
        } catch (err) {
            throw err;
        }
    }


     public async getMyOrders(input: OrderInquiry): Promise<Order[]> {
        try {
            const result = await axios.get(getApiUrl("order/all"), {
              withCredentials: true,
              params: {
                page: input.page,
                limit: input.limit,
                orderStatus: input.orderStatus,
              },
            });

            return result.data;
        } catch (err) {
            throw err;
        }
    }

     public async updateOrder(input: OrderUpdateInput): Promise<Order> {
        try {
            const result = await axios.post(getApiUrl("order/update"), input, {
              withCredentials: true,
            });

            return result.data;
        } catch (err) {
            throw err;
        }
    }

}


export default  OrderService;
