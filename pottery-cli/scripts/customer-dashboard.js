import ELB_PUBLIC_DNS from "./modules/config.js";
const baseUrl = ELB_PUBLIC_DNS || "http://localhost"

const potterySection = document.querySelector("#pottery-section");

const loadPottryIndex = async () => {
  try {
    const response = await fetch(`${baseUrl}/ceramics/`);
    const data = await response.json();

    data.map((i) => {
      const article = document.createElement("article");
      article.setAttribute("data-item-id", i.id); 

      const subHeader = document.createElement("p");
      subHeader.classList.add("subheader");
      const creator = document.createElement("p"); 
      const clayUsed = document.createElement("p");
      const size = document.createElement("p");
      const style = document.createElement("p");
      const price = document.createElement("p"); 

      subHeader.textContent = i.piece;
      creator.textContent = `Creator: ${i.creator}`;
      clayUsed.textContent = i.clay;
      size.textContent = i.size;
      style.textContent = i.style;
      price.textContent = `Price: £${i.price}`; 

      
      const purchaseDiv = document.createElement("div");
      purchaseDiv.classList.add("purchase-piece"); 

      const quantityInput = document.createElement("input");
      quantityInput.classList.add("purchase-quantity");
      quantityInput.type = "number";
      quantityInput.min = 1; 
      quantityInput.placeholder = "Enter quantity";

      
      const purchaseButton = document.createElement("button");
      purchaseButton.classList.add("purchase-button");
      purchaseButton.textContent = "Purchase";

  
      purchaseDiv.appendChild(quantityInput);
      purchaseDiv.appendChild(purchaseButton);

    
      purchaseButton.addEventListener("click", () => {
        const itemId = article.getAttribute("data-item-id"); 
        handlePurchase(itemId, quantityInput.value, purchaseButton); 
      });


      article.appendChild(subHeader);
      article.appendChild(creator); 
      article.appendChild(clayUsed);
      article.appendChild(size);
      article.appendChild(style);
      article.appendChild(price); 
      article.appendChild(purchaseDiv); 

     
      potterySection.appendChild(article);
    });
  } catch (error) {
    console.log(error.message);
  }
};


async function handlePurchase(itemId, quantity, purchaseButton) {
  const purchaseData = {
    saleTime: getCurrentDate(),
    saleNumber: quantity,
    ceramicItem: itemId,
  };

  try {
   
    const response = await fetch(`${baseUrl}/sales/makeSale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorisation": localStorage.getItem("token"), 
      },
      body: JSON.stringify(purchaseData),
    });

    const responseData = await response.json();
    if (responseData.success) {
  
      purchaseButton.textContent = "Success";
      purchaseButton.style.backgroundColor = "#90EE90";
      
  
      setTimeout(() => {
        purchaseButton.textContent = "Purchase";
        purchaseButton.style.backgroundColor = "#FFEAD5";
      }, 3000); 
    }
  } catch (error) {
    console.error("Error processing purchase:", error);
  }
}

loadPottryIndex();

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const day = String(today.getDate()).padStart(2, '0'); 
  return `${year}-${month}-${day}`;
}
