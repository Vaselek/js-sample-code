import React from react;
import PropTypes from prop-types;
import {InjectIntl} from "../Common/InjectIntl";
import ReactTooltip from react-tooltip;
import FinalDataTabTable from "./FinalDataTabTable";
import isEmpty from lodash;


class FinalDataTab extends React.Component {
  static propTypes = {
    searchTxt: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    editingQuestion: PropTypes.object.isRequired,
    questionnaireId: PropTypes.string.isRequired,
    workspaceId: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
    totalDataSize: PropTypes.number.isRequired,
    table: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    jobShouldProcess: PropTypes.bool.isRequired,
    errors: PropTypes.array.isRequired,
    actions: PropTypes.shape({
      openQuestionEditModal: PropTypes.func.isRequired,
      closeQuestionEditModal: PropTypes.func.isRequired,
      changeDescription: PropTypes.func.isRequired,
      fetchDataForFirstPage: PropTypes.func.isRequired,
      saveQuestion: PropTypes.func.isRequired,
      fetchDataForPage: PropTypes.func.isRequired,
      onSizePerPageList: PropTypes.func.isRequired,
      search: PropTypes.func.isRequired,
      resetSearchTxt: PropTypes.func.isRequired
    })
  };

  componentDidMount() {
    this.props.actions.fetchDataForPage(this.props.currentPage, this.props.sizePerPage, this.props.questionnaireId);
  }

  handleDescriptionChange = (event) => {
    this.props.actions.changeDescription(event.target.value);
  };

  handleQuestionClick = (questionId)=> {
    this.props.actions.openQuestionEditModal(questionId);
  };

  renderTooltip = (question) => {
    const description = question.description ? question.description : ;
    return "<div><h4>"+question.label+"</h4><p>"+description+"</p></div>";
  };

  onPageChange(page, sizePerPage) {
    this.props.actions.fetchDataForPage(page, sizePerPage, this.props.questionnaireId, this.props.searchTxt);
  }

  onSizePerPageList(sizePerPage) {
    this.props.actions.fetchDataForPage(this.props.currentPage, sizePerPage, this.props.questionnaireId, this.props.searchTxt)
  }

  onSearchChange(searchText) {
    const text = searchText.trim();
    if (text === ) {
      this.props.actions.fetchDataForPage(1, this.props.sizePerPage, this.props.questionnaireId);
      this.props.actions.resetSearchTxt();
    }
    this.props.actions.search(text, this.props.questionnaireId, this.props.sizePerPage);
  }

  renderErrors = (errors) => {
    return errors.map((error, index) => {
      return <span key={index}>{this.props.intl(error)}</span>
    })
  }

  renderQuestionWithTooltip = (question) => {
    return (
      <div>
        <div data-tip={this.renderTooltip(question)} className="final-dataset-question">
          <div className="final-dataset-title">{question.label}</div>
          <i onClick={this.handleQuestionClick.bind(null, question)}
             className="fa fa-info-circle fa-stack-x  text-success pull-right info-icon icon-position"/>
        </div>
        <ReactTooltip
          type="light"
          multiline={true}
          html={true}
          className="final-dataset-tooltip"
        />
      </div>
    )
  };

  render() {
    const { questions } = this.props;
    const hasQuestions = questions.length > 0;
    if (!hasQuestions) return false;
    return (
      <div className="panel-body m-t-md">
        { !this.props.isLoading ?
          <div>
            {!isEmpty(this.props.errors) && <div className="alert alert-danger">{this.renderErrors(this.props.errors)}</div>}
            <FinalDataTabTable onPageChange={ this.onPageChange.bind(this) }
                               onSizePerPageList={ this.onSizePerPageList.bind(this) }
                               sizePerPage={this.props.sizePerPage}
                               currentPage={this.props.currentPage}
                               data={this.props.data}
                               totalDataSize={this.props.totalDataSize}
                               questions={this.props.questions}
                               searchTxt={this.props.searchTxt}
                               onSearchChange={ debounce(this.onSearchChange.bind(this), 1000) }
                               renderQuestionWithTooltip={this.renderQuestionWithTooltip.bind(this)} />
          </div> : <div className="sk-spinner sk-spinner-rotating-plane" />
        }
      </div>
    );
  }
}

export default InjectIntl(FinalDataTab);
