import { Accordion, Badge, Button, Card } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import jsPDF from "jspdf";
import MainScreen from "../../modules/CustomerPageModules/Customer/MainScreen";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePurchaseAction,
  listPurchases,
} from "../../../actions/purchasesActions";
import Loading from "../../modules/CustomerPageModules/Customer/Loading";
import ErrorMessage from "../../modules/CustomerPageModules/Customer/ErrorMessage";
import context from "react-bootstrap/esm/AccordionContext";

const Mypurchases = ({ search }) => {
  const dispatch = useDispatch();

  const purchaseList = useSelector((state) => state.purchaseList);
  const { loading, purchases, error } = purchaseList;

  const customerLogin = useSelector((state) => state.customerLogin);
  const { customerInfo } = customerLogin;

  const purchaseCreate = useSelector((state) => state.purchaseCreate);
  const { success: successCreate } = purchaseCreate;

  const purchaseUpdate = useSelector((state) => state.purchaseUpdate);
  const { success: successUpdate } = purchaseUpdate;

  const purchaseDelete = useSelector((state) => state.purchaseDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = purchaseDelete;

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deletePurchaseAction(id));
    }
  };

  //console.log(purchases);

  const history = useHistory();

  useEffect(() => {
    dispatch(listPurchases());
    if (!customerInfo) {
      history.push("/");
    }
  }, [
    dispatch,
    successCreate,
    history,
    customerInfo,
    successUpdate,
    successDelete,
  ]);

  function pdfGenerate(title, category, content, updatedAt) {
    var doc = new jsPDF("landscape", "px", "a4", "false");
    doc.setFont("Helvertica", "bold");
    doc.setFontSize(20);
    doc.text(250, 30, "GQ INTERNATIONAL");
    doc.setFontSize(16);
    doc.text(244, 50, "Specialist in Auto Door Handles");
    doc.setFontSize(15);
    doc.text(265, 70, "contactgqintl@gmail.com");
    doc.setFontSize(14);
    doc.text(500, 90, "Tel: 072-7788877");
    doc.line(20, 100, 600, 100);
    doc.setFont("Helvertica", "bold");
    doc.text(60, 130, "Title :");
    doc.text(60, 150, "Category :");
    doc.text(60, 170, "Content :");
    doc.text(60, 190, "Purchased on :");
    doc.setFont("Helvertica", "normal");
    doc.text(100, 130, title);
    doc.text(110, 150, category);
    doc.text(110, 170, content);
    doc.text(130, 190, updatedAt.substring(0, 10));
    doc.line(20, 270, 600, 270);
    doc.save("GQ Internatipnals purchase.pdf");
  }

  return (
    <MainScreen title={`${customerInfo.name} Purchase History`}>
      <Link to="/createpurchase">
        <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
          Add a new purchase
        </Button>
      </Link>
      <Link to="/customerpurchasereport">
        <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
          Download Report
        </Button>
      </Link>
      {errorDelete && (
        <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
      )}
      {loadingDelete && <loading />}
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}
      {purchases
        ?.reverse()
        .filter((filteredPurchase) =>
          filteredPurchase.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((purchase) => (
          <Accordion key={purchase._id} id="content">
            <Card style={{ margin: 10 }}>
              <Card.Header style={{ background: "#D3D3D3", display: "flex" }}>
                <span
                  style={{
                    color: "black",
                    textDecoration: "none",
                    flex: 1,
                    cursor: "pointer",
                    alignSelf: "center",
                    fontSize: 18,
                  }}
                >
                  {purchase.title}
                </span>
                <div>
                  <Button href={`/purchase/${purchase._id}`}>Edit</Button>{" "}
                  <Button
                    variant="danger"
                    className="mx-2"
                    onClick={() => deleteHandler(purchase._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() =>
                      pdfGenerate(
                        purchase.title,
                        purchase.category,
                        purchase.content,
                        purchase.updatedAt
                      )
                    }
                  >
                    Download PDF
                  </Button>
                </div>
              </Card.Header>
              <Card.Body style={{ background: "#FFF" }}>
                <h6 style={{ color: "green" }}>{purchase.content}</h6>
              </Card.Body>
              <Card.Body style={{ background: "#FFF" }}>
                <h4>
                  <Badge variant="success">
                    Category - {purchase.category}
                  </Badge>
                </h4>

                <blockquote className="blackquote mb-0">
                  <br />
                  <footer className="blockquote-footer">
                    <b style={{ color: "black" }}>
                      Created on{" "}
                      <cite title="Source Title">
                        {purchase.updatedAt.substring(0, 10)}
                      </cite>
                    </b>
                  </footer>
                </blockquote>
              </Card.Body>
            </Card>
          </Accordion>
        ))}
    </MainScreen>
  );
};

export default Mypurchases;
