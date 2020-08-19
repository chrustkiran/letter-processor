import React from "react";
import {Badge, Button, Col, Divider, Input, message, Modal, Radio, Row, Select, Spin, Upload, Tag} from "antd";
import {FileExcelTwoTone, FolderOpenTwoTone, InboxOutlined} from '@ant-design/icons';
import {FileService} from "../services/FileService";

const {Dragger} = Upload;
const {Option} = Select;

export class HomePage extends React.Component {

    constructor() {
        super();
        this.getFiles();
    }

    selectedSubject = '';

    state = {
        totalFile: 0,
        files: [],
        showListFiles: false,
        selectedFile: '',
        roadId: '',
        searching: false,
    };

    getFiles = () => {
        FileService.getFiles().then(data => {
            this.setState({files: data});
            this.setState({totalFile: data.length});
            if (data != undefined && data.length > 0) {
                this.setState({
                    selectedFile: data[0],
                });
                FileService.selectFile(data[0]).then(
                    res => {
                        this.getSubjects();
                    }
                )

            }
        });
    };

    getSubjects = () => {
        FileService.getSubjects().then(data => {
            this.setState({subjects: data});
        });
    }

    onChangeStatus = (info) => {
        const {status} = info.file;
        if (status === 'done') {
            this.getFiles();
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    showListFiles = () => {
        this.setState({
            showListFiles: true,
        });
    };

    handleOk = e => {
        this.setState({
            showListFiles: false,
        });
    };

    handleCancel = e => {
        this.setState({
            showListFiles: false,
        });
    };

    conf = {
        name: 'file',
        multiple: false,
        action: 'http://localhost:8080/file/upload',
        onChange: (info) => {
            this.onChangeStatus(info);
        },
        showUploadList: false
    };

    onSelectFileChange = e => {
        this.setState({
            selectedFile: e.target.value,
        });
        FileService.selectFile(e.target.value).then(
            res => {
                this.getSubjects();
            }
        )
    };

    displayUploadedFiles = () => {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        if (this.state.files.length > 0) {
            return (
                <Radio.Group onChange={this.onSelectFileChange} value={this.state.files[0]}>
                    {
                        this.state.files.map(file => {
                            return (
                                <Radio style={radioStyle} value={file}>
                                    {file}
                                </Radio>
                            )
                        })}
                </Radio.Group>)
        }
    };


    onSubjectChanges = (value) => {
        //this.setState({selectedSubject: value})
        this.selectedSubject = value;
        console.log(value);
    };

    onSubjectSearch = (val) => {

    };

    onRoadIdChange = (val) => {
        this.setState({roadId: val.target.value});
    };

    searchLetter = () => {
        this.setState({letters: null});
        const bodyObj = {
            rows: this.state.subjects[this.selectedSubject],
            RoadId: this.state.roadId
        };
        this.setState({searching: true});
        FileService.getLetters(bodyObj).then(data => {
            this.setState({searching: false});
            this.setState({letters: data});
        });
    };


    //https://polar-falls-02493.herokuapp.com/

    render() {
        // this.getFiles();
        return (
            <div>
                <Row>
                    <Col flex='40%'>
                        <Dragger {...this.conf}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single upload.
                            </p>
                        </Dragger>,
                    </Col>
                    <Col flex='30%' style={{marginTop: '4%'}}>
                        <Badge style={{backgroundColor: '#52c41a'}} count={this.state.totalFile}>
                            <FolderOpenTwoTone onClick={this.showListFiles}
                                               style={{fontSize: '48px'}}></FolderOpenTwoTone>
                        </Badge>
                        <p>Uploaded files</p>
                    </Col>
                    <Col flex='30%' style={{marginTop: '4%'}}>
                        <FileExcelTwoTone style={{fontSize: '48px'}}></FileExcelTwoTone>
                        <br/>
                        <p>Selected File
                            <br/>
                            <b>{this.state.selectedFile}</b>
                        </p>

                    </Col>
                </Row>
                <br/>
                <Divider/>
                {this.state.subjects &&
                <Row>
                    <Col flex={'40%'}>
                        <Select
                            showSearch
                            style={{width: 200}}
                            placeholder="Select a subject"
                            optionFilterProp="children"
                            onChange={this.onSubjectChanges}
                            onSearch={this.onSubjectSearch}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {Object.keys(this.state.subjects).map(sub => {
                                return (
                                    <Option value={sub}>{sub}</Option>
                                )
                            })}
                        </Select>
                    </Col>
                    <Col flex={'40%'}>
                        <Input style={{width: '50%'}} placeholder={'Road Id'} width='40%' onChange={this.onRoadIdChange}></Input>
                    </Col>
                    <Col flex={'20%'}>
                        <Button style={{width: '40%'}} type="primary" onClick={this.searchLetter} block>
                            Search
                        </Button>
                    </Col>
                </Row>
                }
                <br/>
                <br/>
                <p>
                    {this.state.searching &&
                    <Spin/>}
                    {this.state.letters &&
                    Object.keys(this.state.letters).map(date => {
                        return (
                            <div>
                                <b>{date}</b>
                                <p>
                                    {
                                        this.state.letters[date].map(letter => {
                                            return (
                                                <div>
                                                    <Tag color="green"> {letter[0]}</Tag>
                                                    <Tag color="gold"> {letter[1]}</Tag>
                                                </div>
                                            )
                                        })
                                    }
                                </p>
                            </div>


                        )
                    })
                    }
                </p>

                <Modal
                    title="Uploaded files"
                    visible={this.state.showListFiles}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>
                        {this.displayUploadedFiles()}
                    </p>
                </Modal>
            </div>
        )
    }
}
