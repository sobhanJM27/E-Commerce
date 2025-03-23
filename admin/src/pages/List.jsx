import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const [isListLoading, setListLoading] = useState(false);
  const [removeLoadingId, setRemoveLoadingId] = useState(null);

  const fetchList = async () => {
    try {
      setListLoading(true);
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      setRemoveLoadingId(id);
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        {
          id,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
      setRemoveLoadingId(null);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>
        {/* Product List */}
        {isListLoading ? (
          list?.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
              key={index}
            >
              <img className="w-12" src={item.image[0]} alt="" />
              <span>{item.name}</span>
              <span>{item.category}</span>
              <span>
                {currency}
                {item.price}
              </span>
              <span
                onClick={() => removeProduct(item._id)}
                className="text-right md:text-center cursor-pointer text-lg"
              >
                {removeLoadingId === item._id ? (
                  <div className="flex justify-center items-center">
                    <ThreeDots
                      visible={true}
                      height="20"
                      width="20"
                      color="#242020"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                ) : (
                  "X"
                )}
              </span>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center">
            <ThreeDots
              visible={true}
              height="30"
              width="30"
              color="#242020"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}
      </div>
    </>
  );
};

export default List;
